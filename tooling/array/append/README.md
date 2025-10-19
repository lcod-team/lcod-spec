# lcod://tooling/array/append@0.1.0

Append optional arrays and/or a single value to the provided list without
mutating the original array.

## Inputs

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `items` | array | No | Source array (defaults to an empty list). |
| `value` | any | No | Single value appended at the end when provided. |
| `values` | array | No | Additional items concatenated before `value`. |

## Outputs

| Name | Type | Description |
| ---- | ---- | ----------- |
| `items` | array | Updated array including the appended entries. |
| `length` | number | Length of the array after the append operation. |
