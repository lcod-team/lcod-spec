<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://tooling/resolver/internal/load-config@0.1.0

Load `resolve.config.json`, merge fallbacks, and expose a normalised resolver configuration.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `projectPath` | string | Yes | Root directory of the project being resolved. |
| `configPath` | string | No | Explicit path to the resolver configuration file. |
| `outputPath` | string | No | Optional explicit destination for `lcp.lock` (propagated downstream). |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `configPath` | string | Resolved path of the configuration that was loaded. |
| `config` | object | Normalised resolver configuration. |
| `warnings` | array<string> | Warnings emitted while loading the configuration. |
| `projectPath` | string | null | Passthrough of the project root path. |
| `outputPath` | string | null | Passthrough of the optional output path. |
