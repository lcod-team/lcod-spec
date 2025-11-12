<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://tooling/resolver/internal/load-sources@0.1.0

Resolve resolver sources.json into inline registry catalogue entries.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `projectPath` | string | Yes | Base directory of the project invoking the resolver. |
| `cacheDir` | string | No | Directory used to cache downloaded catalogues. |
| `sourcesPath` | string | No | Explicit path to a sources.json file. Defaults to <projectPath>/sources.json. |
| `resolverConfig` | object | No | Resolved resolver configuration (resolve.config.json) used for fallbacks. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `registrySources` | array<object> | Inline registry entries ready for indexing. |
| `warnings` | array<string> | Resolved warnings while gathering catalogues. |
| `sourcesPath` | string | null | Path to the sources.json file used for this run. |

## Notes

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
