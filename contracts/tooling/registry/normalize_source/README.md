<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://contract/tooling/registry/normalize_source@1.0.0

Validate and normalize a registry source entry, returning warnings when invalid.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `entry` | object | Yes | Raw registry source entry. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `entry` | object | null | Normalized entry (null when rejected). |
| `warnings` | array<string> | Warnings emitted while normalizing the entry. |
