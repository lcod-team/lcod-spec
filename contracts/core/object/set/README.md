# core/object/set

Assigns a value to a nested path within an object and returns the updated structure. The contract supports immutable updates as well as in-place mutation.

## Inputs

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| `object` | object | yes | Source object to update. |
| `path` | array | yes | Array of keys/indices describing where to set the value. |
| `value` | any | yes | Value to assign at the provided path. |
| `clone` | boolean | no | When `true` (default) the implementation must return a cloned object; `false` allows in-place mutation. |
| `createMissing` | boolean | no | When `true` (default) missing intermediate containers are created automatically. |

## Outputs

| Field | Type | Description |
| ----- | ---- | ----------- |
| `object` | object | Updated object after the assignment. |
| `created` | boolean | Indicates whether the value was newly created (path did not exist previously). |

Implementations must honour the `clone` flag and should throw an error if the path cannot be traversed (e.g. encountering a primitive where an object is expected) and `createMissing` is `false`.
