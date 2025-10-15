# Resolver Configuration

Resolvers keep their runtime configuration alongside the project. Two files work
together:

- `sources.json` — declares which registry catalogues should be merged and how
  they are authenticated.
- `resolve.config.json` — optional overrides that tweak resolution after the
  catalogues are loaded (mirrors, replacements, bindings).

## `sources.json`

The resolver ships with a default `sources.json` pointing at the official LCOD
registry. Projects can add their own file at the workspace root to override or
append sources. The schema identifier is `lcod-resolver/sources@1`.

```json
{
  "schema": "lcod-resolver/sources@1",
  "defaults": {
    "priority": 100
  },
  "sources": [
    {
      "id": "lcod-default",
      "description": "Official LCOD registry catalogues",
      "priority": 50,
      "entrypoint": {
        "type": "https",
        "url": "https://raw.githubusercontent.com/lcod-team/lcod-registry/main/catalogues.json"
      },
      "checksum": "sha256-…",
      "publicKey": "keys/tooling/lcod-team.pem"
    },
    {
      "id": "local-checkout",
      "description": "Local registry next to the project",
      "priority": 10,
      "entrypoint": {
        "type": "file",
        "path": "../lcod-registry/catalogues.json"
      }
    },
    {
      "id": "partners/payments",
      "description": "Partner catalogue hosted in a Git repository",
      "priority": 80,
      "entrypoint": {
        "type": "git",
        "url": "https://github.com/acme/payments-registry.git",
        "commit": "c7afef2038cf4aa3b1cf076a5f62b143b3b7c56e",
        "subpath": "registry/catalogues.json"
      }
    }
  ]
}
```

### Fields

- `schema` — must be `lcod-resolver/sources@1`.
- `defaults` — optional shared values applied to every entry when the field is
  omitted (most commonly `priority` or retry settings).
- `sources` — ordered list of catalogue sources. Lower priority wins; when
  priorities match the first entry in the array takes precedence.
- `entrypoint` — transport used to fetch the pointer file:
  - `https` / `http`: simple download. Provide `url` and optional HTTP headers
    in `transport.headers`.
  - `git`: clone the repository, restrict to `commit` (or `ref`), then read
    `subpath` (defaults to `catalogues.json`).
  - `file`: resolve `path` relative to the configuration file (or use an
    absolute path).
- `checksum` — optional SHA-256 digest (`sha256-…`) used to verify integrity.
- `signature` / `publicKey` — optional detached signature support. When set,
  the resolver downloads the signature and verifies it with the provided key.
- `metadata` — free-form object preserved for tooling (for instance, IDE badges
  or UI labels).

## `resolve.config.json`

The legacy configuration file still controls mirrors, replacements and contract
bindings. Projects may keep using a single file for now; once the resolver
consumes `sources.json` natively the legacy `sources` map will be ignored.

```json
{
  "mirrors": {
    "https://registry.lcod.dev": "https://mirror.example.com"
  },
  "replace": {
    "lcod://impl/net/http-client@1": "lcod://org/custom-fetch@1"
  },
  "bindings": {
    "lcod://contract/net/http-client@1": "lcod://impl/net/fetch@1.2.0"
  }
}
```

Resolvers load this configuration (explicit `configPath` or the default
`resolve.config.json` at project root). Unknown keys are ignored. If no
configuration file can be read the resolver records a warning in the lockfile so
hosts can surface the issue.

The resolver compose writes fetched artefacts to the directory returned by
`lcod://tooling/resolver/cache-dir@1` (project `.lcod/cache` by default,
overridable via `LCOD_CACHE_DIR` or falling back to `~/.cache/lcod`).

### Source types

The `sources` map associates a dependency identifier with a retrieval policy:

- **Path** — `{ "type": "path", "path": "./relative/or/absolute" }` resolves
  components from the local filesystem.
- **Git** — `{ "type": "git", "url": "...", "ref": "main", "subdir":
  "packages/app", "depth": 1, "force": false }` clones the repository,
  optionally targeting a specific ref or sub-directory. When omitted, the
  resolver falls back to registry lookup.
- **HTTP/Archive** — `{ "type": "http", "url": "...", "descriptorPath":
  "inner/lcp.toml", "filename": "component.tar", "force": false }` downloads
  artefacts via `http/download@1`. Files land under `./.lcod/cache/http/<hash>`
  (or `$LCOD_CACHE_DIR`, then `~/.cache/lcod`) and are reused unless `force` is
  set.

For all source types, the resolver computes a SHA-256 integrity string for
`lcp.toml` (`sha256-…`) and includes it in the lockfile. Dependants may override
the cache root with the `LCOD_CACHE_DIR` environment variable.
