<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://tooling/resolver/internal/load-descriptor@0.1.0

Load the project descriptor (`lcp.toml`) and expose its parsed contents.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `projectPath` | string | Yes | Absolute or relative path to the project root containing `lcp.toml`. |
| `configPath` | string | null | No | Optional resolve.config.json path (propagated downstream). |
| `outputPath` | string | null | No | Optional explicit lockfile output path (propagated downstream). |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `descriptorPath` | string | Absolute path to the descriptor that was loaded. |
| `descriptorText` | string | Raw TOML contents of the project descriptor. |
| `descriptor` | object | Parsed descriptor object. |
| `projectPath` | string | null | Passthrough of the project root path. |
| `configPath` | string | null | Passthrough of the resolve.config.json path. |
| `outputPath` | string | null | Passthrough of the explicit output path. |
