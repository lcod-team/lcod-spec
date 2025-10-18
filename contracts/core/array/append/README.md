# Contract: core/array/append@1

Concatenates an existing array with additional values. This contract always
returns a new array and leaves the inputs unchanged.

## Inputs (`schema/append.in.json`)

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| `array` | array | yes | Base array. |
| `items` | array | no | Array of items to append. Optional when `item` is provided. |
| `item` | any | no | Single item to append. Optional when `items` is provided. |

At least one of `items` or `item` must be supplied. When both are present, the
contract behaves as if `item` was appended after `items`.

## Outputs (`schema/append.out.json`)

| Field | Type | Description |
| ----- | ---- | ----------- |
| `value` | array | New array containing the appended elements. |
| `length` | number | Length of the resulting array. |

Implementations never mutate the input array. Sparse arrays are preserved as-is
(the missing indices remain missing in the copy).
