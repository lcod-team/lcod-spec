<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://tooling/resolver/internal/resolve-dependencies@0.1.0

Resolve the dependency graph using normalised configuration and cache information.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `projectPath` | string | Yes | Base project directory. |
| `cacheRoot` | string | Yes | Cache directory used for dependency downloads. |
| `normalizedConfig` | object | Yes | Normalised resolver configuration. |
| `config` | object | No | Raw resolver configuration (pre-normalisation). |
| `rootId` | string | null | No | Explicit root component identifier when provided. |
| `rootDescriptor` | object | Yes | Parsed root descriptor. |
| `rootDescriptorText` | string | Yes | Raw root descriptor contents. |
| `warnings` | array<string> | No | Warnings accumulated so far. |
| `registryPackages` | object | No | Registry packages indexed from previous steps. |
| `registryEntries` | array<object> | No | Flattened registry entries used for inspection. |
| `registryRegistries` | array<object> | No | Registry descriptors collected from JSONL streams. |
| `registryWarnings` | array<string> | No | Warnings produced while loading registry metadata. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `resolverResult` | object | Resolver result containing the dependency graph. |
| `warnings` | array<string> | Warnings emitted during dependency resolution. |
| `contractSourcesSnapshot` | object | Snapshot of the sources map passed to the resolver contract. |
