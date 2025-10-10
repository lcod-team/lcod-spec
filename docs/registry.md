# LCOD Registry Architecture

This document specifies the minimal registry model used to publish and consume LCOD
components. The design keeps kernels small, lets the resolver do the heavy lifting,
and allows organisations to extend or mirror the registry without custom servers.

## 1. Goals

- **Git-first & HTTP-friendly**: the official registry is a Git repository. Static
  hosting (GitHub Pages, S3) is enough for read access.
- **KISS publication**: a new component is added through a pull request that links
  to an immutable Git commit (no bespoke API).
- **Deterministic resolution**: every entry includes hashes so the resolver can
  verify downloads and populate `lcp.lock`.
- **Composable registries**: clients can chain official and community registries
  and override the lookup order locally.
- **Offline cache**: downloaded artefacts are cached on disk and reused when
  available.
- **Ready for RAG**: manifests and docs live alongside the index so the search
  service can ingest them easily.

## 2. Repository Layout

The registry root contains two primary directories:

```
registry.json               # top-level index (registries + package catalogue)
packages/<namespace>/<name>/versions.json
packages/<namespace>/<name>/<version>/manifest.json
packages/<namespace>/<name>/<version>/manifest.sig        (optional)
packages/<namespace>/<name>/<version>/files/<relative-path>
```

### 2.1 `registry.json`

`registry.json` combines global configuration with pointers to available packages.

```json
{
  "schema": "lcod-registry@1",
  "registries": [
    { "id": "official", "type": "http", "url": "https://lcod-team.github.io/registry" },
    { "id": "acme", "type": "git", "url": "https://git.acme.com/lcod/registry.git" }
  ],
  "namespaces": {
    "lcod": { "owners": ["github:lcod-team"], "requireSignature": true },
    "acme": { "owners": ["gitlab:acme/platform"], "requireSignature": false }
  },
  "packages": {
    "lcod://tooling/log": { "registry": "official" },
    "acme://payments/checkout": { "registry": "acme" }
  }
}
```

- `registries` enumerates other registries that can be chained. Clients merge this
  list with their local configuration when resolving packages.
- `namespaces` documents ownership metadata (used to validate submissions).
- `packages` indicates which registry hosts the metadata for a given component ID.

### 2.2 `versions.json`

Each component has a catalogue of published versions:

```json
{
  "schema": "lcod-registry/versions@1",
  "id": "lcod://tooling/log",
  "versions": [
    { "version": "1.2.0", "manifest": "1.2.0/manifest.json", "sha256": "…" },
    { "version": "1.1.0", "manifest": "1.1.0/manifest.json", "sha256": "…" }
  ]
}
```

The resolver reads this file, applies semantic version constraints, and then
downloads the selected manifest.

### 2.3 `packages.jsonl`

To keep lookups fast even when the catalogue grows, the registry also publishes
an append-only JSON Lines index:

```
{"kind":"registry","id":"official","type":"http","url":"https://lcod-team.github.io/registry"}
{"kind":"registry","id":"acme","type":"git","url":"https://git.acme.com/lcod/registry.git"}
{"kind":"component","id":"lcod://tooling/log","version":"1.2.0","manifest":"packages/lcod/tooling/log/1.2.0/manifest.json","sha256":"…"}
{"kind":"component","id":"lcod://tooling/log","version":"1.1.0","manifest":"packages/lcod/tooling/log/1.1.0/manifest.json","sha256":"…"}
```

- Lines with `kind="registry"` MUST appear first and describe external registries
  referenced by this index.
- Each `kind="component"` line mirrors an entry from `versions.json`. Entries are
  ordered newest → oldest to make “first match wins” resolution trivial when a
  strict version is requested.
- Clients may stream the file sequentially: local overrides are processed first,
  followed by official entries. This keeps community registries usable without
  imposing a monolithic manifest.

## 3. Component Manifest

`manifest.json` is the single source of truth for a component version.

```json
{
  "schema": "lcod-registry/manifest@1",
  "id": "lcod://tooling/log@1.2.0",
  "publishedAt": "2025-10-10T12:00:00Z",
  "source": {
    "type": "git",
    "url": "https://github.com/lcod-team/lcod-tooling.git",
    "commit": "abc123…",
    "path": "components/tooling/log"
  },
  "files": [
    { "path": "lcp.toml", "sha256": "…", "size": 2048 },
    { "path": "README.md", "sha256": "…", "size": 5120 },
    { "path": "schema/input.json", "sha256": "…" }
  ],
  "artifact": {
    "url": "https://github.com/lcod-team/lcod-tooling/releases/download/v1.2.0/tooling-log.lcod.tar.zst",
    "sha256": "…",
    "compression": "zstd"
  },
  "dependencies": [
    { "id": "lcod://tooling/log@^1.0.0" },
    { "id": "lcod://core/fs@>=0.2.0 <0.3.0" }
  ]
}
```

- `source` points at the immutable Git commit used to build the component.
- `files` lists individual files that may be fetched separately (fallback when no
  pre-built artefact is present).
- `artifact` (optional) references a packaged archive; the resolver prefers this
  when available.
- `dependencies` collects semantic version constraints; these are resolved by the
  client to construct an `lcp.lock`.

`manifest.sig` (optional) is the detached signature of the manifest. The registry
publishes trusted public keys in `keys/<namespace>/<owner>.pem`.

## 4. Resolution Workflow

1. **Bootstrap**: load the resolver configuration (local `registries.json`) and
   merge it with `registry.json` from the default registry.
2. **Locate package**: find which registry hosts the requested component by
   consulting `registry.json` entries (fall back to local overrides).
3. **Catalogue lookup**: download `versions.json` from the selected registry,
   apply the requested semantic version range, and select the newest compatible
   version.
   - When available, clients can eagerly scan `packages.jsonl` (local copy plus
     upstream updates) to resolve most lookups without touching individual
     `versions.json` files.
4. **Manifest fetch**: download `manifest.json` (and verify the detached signature
   if required by the namespace policy).
5. **Artefact acquisition**:
   - If `artifact` is present, download it, check the hash, and unpack into the
     local cache.
   - Otherwise download each file listed under `files`, verifying hashes.
6. **Dependency walk**: repeat the process for every dependency declared in the
   manifest.
7. **Lockfile update**: record the selected versions, commit hashes, and artefact
   hashes in `lcp.lock`.

The resolver never mutates kernel behaviour; it only prepares `lcod_modules/`
for the runtime.

## 5. Caching Strategy

- Artefacts and individual files are cached under
  `~/.lcod/cache/<sha256>`. Files are deduplicated by hash.
- Manifests and catalogues are cached with their ETag / Last-Modified headers to
  support `If-None-Match` requests. For Git registries, the resolver can issue a
  lightweight `git ls-remote` or `HEAD` request to detect updates before pulling.
- `packages.jsonl` is fetched with the same conditional requests so incremental
  updates are cheap; clients only re-download when the upstream checksum changes.
- A registry may publish a `cache.json` hint with mirror URLs; clients can opt-in.

## 6. Publication Workflow

1. Component maintainers prepare their repository (ensuring `lcp.toml`,
   documentation, and tests are up to date).
2. Optionally build a compressed bundle (`tooling-log.lcod.tar.zst`) in CI and
   publish it under the repository releases.
3. Run the helper script (to be provided in `lcod-resolver`) that generates the
   manifest, validates hashes, and opens a pull request against the official
   registry repository.
4. Registry maintainers review the PR, confirm namespace ownership, and merge.
   Once merged, the entry becomes available immediately to all clients.

Community registries follow the same flow but relax ownership checks at their
discretion.

## 7. Semantic Versions & Updates

- Versions follow SemVer (`MAJOR.MINOR.PATCH`). `versions.json` keeps all published
  entries immutable.
- The resolver understands common constraints (`^1.2.0`, `~1.4.0`,
  `>=1.0.0 <2.0.0`).
- `lcod-resolver update` recalculates the dependency graph and upgrades locked
  versions when newer compatible releases exist.
- Components that declare incompatible changes must bump the major version; the
  resolver never selects a version outside the requested range.

## 8. Mirroring & Local Overrides

- A simple `lcod-resolver mirror <registry-url> <target-dir>` command clones the
  registry repository (or replays the streamed `packages.jsonl`) and rewrites
  artefact URLs to point at the mirror host.
- Developers can create `~/.lcod/registries.json` to prepend internal registries:

```json
{
  "registries": [
    { "id": "corp", "type": "http", "url": "https://registry.corp.example.com" },
    { "id": "official", "type": "http", "url": "https://lcod-team.github.io/registry" }
  ]
}
```

This file controls the lookup order without modifying the official index. The
resolver processes registries in the declared order (`first match wins`), falling
back to the next one when a component or version is missing.

## 9. Security & Authenticity

- Namespace ownership is enforced through the `namespaces` metadata in
  `registry.json`. Maintainers must be listed there for their submissions to be
  accepted.
- Optionally, manifests can be signed. The resolver verifies signatures when the
  namespace flag `requireSignature` is set.
- Hashes in `manifest.json` allow the resolver to detect tampering regardless of
  transport (Git, HTTP, object storage).
- CI on the registry repository rejects pull requests that attempt to modify
  existing version directories, guaranteeing immutability.

## 10. RAG Integration

Because manifests, READMEs, and schema files live alongside the registry index,
they can be ingested by the RAG pipeline:

- A crawler walks `registry.json`, downloads manifests and referenced docs, and
  pushes them into the vector store.
- The IDE or resolver can query the RAG service to surface relevant components
  before composing new ones.
- Generated components can reuse the same publication workflow, enabling a
  feedback loop where AI-authored packages become discoverable like any other.

## 11. Tooling Components

- `tooling/registry/index@1` parses local/remote `packages.jsonl` fragments,
  attaches priority metadata, and groups component versions so resolvers can pick
  the first compatible match.
- `tooling/registry/fetch@1` resolves manifest locations against a registry,
  downloads or reuses cached copies (manifests and optional artefacts), and
  verifies declared SHA-256 hashes.

Both components are pure compose helpers backed by `tooling/script@1`, ensuring
that every kernel can reuse the same behaviour.

## 12. Future Extensions

- Support for additional artefact backends (OCI registries, IPFS).
- Provenance metadata (Sigstore attestations) stored alongside the manifest.
- Incremental indexes (`packages.jsonl`) for faster cold-starts when the registry
  grows.

The current specification keeps implementation simple while providing a clear
path toward richer workflows without changing the core contract.
