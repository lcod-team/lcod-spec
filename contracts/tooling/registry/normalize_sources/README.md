<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://contract/tooling/registry/normalize_sources@1.0.0

Normalize an array of registry sources, returning warnings for invalid entries.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `entries` | array | Yes | Array of raw registry source entries. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `entries` | array<object> | Normalized registry entries (invalid entries omitted). |
| `warnings` | array<string> | Warnings emitted while processing the entries. |
