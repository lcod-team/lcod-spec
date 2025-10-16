# Internal Resolver Helper — load-sources@0.1.0

Loads a resolver `sources.json`, fetches the referenced catalogues, and emits
registry source records that the existing registry tooling can consume.

The component understands pointer entries served over `file`, `http(s)` and
`git` transports. Pointer payloads may either be:

- `lcod-registry/catalogues@1` (catalogue of catalogues) which is expanded
  recursively.
- `lcod-registry/catalogue@1` listing components and versions.

Each concrete catalogue is converted into an inline source with the same shape
as the legacy `registry.sources` configuration so downstream steps can reuse
`tooling/registry/source/load@0.1.0` unchanged.

## Inputs

```json
{
  "projectPath": "/work/my-app",
  "cacheDir": "/work/my-app/.lcod/cache",
  "sourcesPath": "/work/my-app/config/custom-sources.json",
  "resolverConfig": { ... }
}
```

`cacheDir` is optional; when omitted a subdirectory under the project cache is
used. `sourcesPath` defaults to `<projectPath>/sources.json` and falls back to
the official LCOD registry when absent.

## Outputs

```json
{
  "registrySources": [
    {
      "id": "tooling/std",
      "type": "inline",
      "priority": 50,
      "defaults": {
        "id": "tooling/std",
        "type": "http",
        "url": "https://raw.githubusercontent.com/lcod-team/lcod-components/<commit>/"
      },
      "lines": [
        { "kind": "component", "id": "lcod://tooling/array/append", "version": "0.1.0", ... }
      ]
    }
  ],
  "warnings": []
}
```

Warnings are collected instead of throwing so the resolver can surface issues
alongside other diagnostics (checksum mismatch, unsupported catalogue types,
missing manifests, …).
