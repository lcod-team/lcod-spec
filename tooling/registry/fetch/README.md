# Registry Fetch (`tooling/registry/fetch@0.1.0`)

Downloads component manifests (and optional artefacts) from a registry, stores
them in a deterministic cache, and verifies the declared SHA-256 hashes. The
component understands HTTP and file-based registries and gracefully falls back
to existing cached copies when hashes already match.

## Inputs

```json
{
  "entry": {
    "id": "lcod://demo/catalog",
    "version": "1.2.0",
    "manifest": "packages/demo/catalog/1.2.0/manifest.json",
    "sha256": "sha256-…",
    "artifact": {
      "url": "https://…/catalog-1.2.0.lcod.tar.zst",
      "sha256": "sha256-…"
    }
  },
  "registry": {
    "id": "official",
    "type": "http",
    "url": "https://registry.example.com/"
  },
  "cache": {
    "root": "/tmp/lcod-cache",
    "manifestsDir": "manifests",
    "artifactsDir": "artifacts"
  },
  "forceRefresh": false
}
```

- `entry` comes straight from `tooling/registry/index@1`.
- `registry` defaults to `{ "id": entry.registryId }`; `url` is required when
  resolving relative HTTP paths.
- `cache.root` is required; sub-directories default to `manifests` and
  `artifacts`.

## Outputs

```json
{
  "manifestPath": "/tmp/lcod-cache/manifests/demo/catalog/1.2.0/manifest.json",
  "manifest": { "schema": "lcod-registry/manifest@1", … },
  "manifestIntegrity": "sha256-…",
  "artifactPath": "/tmp/lcod-cache/artifacts/demo/catalog/1.2.0/package.tar.zst",
  "artifactIntegrity": "sha256-…",
  "downloaded": true,
  "entry": { … }                 // echo of the input entry
}
```

If the manifest hash mismatches, the component throws. When the hash is absent
the file is trusted as-is and the computed integrity is still returned for
auditing.

## Behaviour

1. Compute deterministic cache paths based on `entry.id` and `entry.version`.
2. Reuse cached files when hashes match (unless `forceRefresh` is `true`).
3. Resolve manifest locations:
   - Absolute `http(s)://` / `file://` URLs are used verbatim.
   - Relative paths are resolved against `registry.url`.
4. After download, hashes are validated using `lcod://axiom/hash/sha256@1`.
5. When `entry.artifact` is present the artefact is fetched to the cache and the
   path returned alongside the manifest.

The component is pure (no kernel state mutation) so different runtimes can share
the same compose logic.
