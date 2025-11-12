<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://contract/core/value/kind@1.0.0

Return the JSON kind (null, boolean, number, string, array, object) for a value.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `value` | object | array | string | number | boolean | null | No | Value to inspect. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `kind` | enum(null, boolean, number, string, …) | Kind string describing the value. |
