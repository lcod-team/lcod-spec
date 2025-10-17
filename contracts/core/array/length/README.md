# core/array/length

Returns the number of elements contained in the provided array.

## Inputs

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| `items` | array | yes | Array whose size will be measured. |

## Outputs

| Field | Type | Description |
| ----- | ---- | ----------- |
| `length` | integer | Number of elements in `items` (always `>= 0`). |

The contract is pure and has no side effects. Kernels should implement it natively for performance.
