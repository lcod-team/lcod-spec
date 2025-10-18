# Contract: core/string/format@1

Formats a template string using named placeholders. Placeholders follow the
`{placeholder}` syntax. Nested values can be referenced with dot notation (for
example `{user.name}`) and array indices (`{items[0]}`).

## Inputs (`schema/format.in.json`)

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| `template` | string | yes | Template containing placeholders. |
| `values` | object | no | Dictionary of replacement values. |
| `fallback` | string | no | Default value when a placeholder cannot be resolved (defaults to empty string). |
| `missingPolicy` | string | no | Behaviour when a placeholder is missing: `ignore` (default) or `error`. |

## Outputs (`schema/format.out.json`)

| Field | Type | Description |
| ----- | ---- | ----------- |
| `value` | string | Formatted string. |
| `missing` | array | Placeholders that were not resolved (only populated when `missingPolicy` is `ignore`). |
| `error` | object | Optional structured error when `missingPolicy` is `error` and a placeholder is missing. |

Implementations must treat `values` as immutable, support at least UTF-8
strings, and escape curly braces using `{{` / `}}`.
