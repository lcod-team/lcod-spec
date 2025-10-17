# core/array/push

Appends a single value to the end of an array and returns the updated collection.

## Inputs

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| `items` | array | yes | Base array that will receive the new value. |
| `value` | any | yes | Value to append to the array. |
| `clone` | boolean | no | When `true` (default) the contract must create a new array; when `false` it may mutate in place. |

## Outputs

| Field | Type | Description |
| ----- | ---- | ----------- |
| `items` | array | Array after the value has been appended. |
| `length` | integer | New length of the array. |

Implementations should honour the `clone` flag to support both immutable and in-place workflows. If a kernel cannot mutate in place, it may always return a cloned array.
