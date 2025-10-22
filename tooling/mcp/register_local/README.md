<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://tooling/mcp/register_local@0.1.0

Register MCP authoring components located on disk (e.g. lcod-components workspace) so they can be used in local workflows.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `componentsRoot` | string | Yes | Filesystem path containing MCP component directories (e.g. lcod-components/packages/std/components). |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `registered` | number | Number of components successfully registered. |
| `warnings` | array | Diagnostics collected while resolving or registering components. |
