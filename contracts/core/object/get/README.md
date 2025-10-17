# core/object/get

Retrieves a nested value from an object using a path expressed as an array of keys/indices.

## Inputs

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| `object` | object | yes | Source object to read from. |
| `path` | array | yes | Array of keys/indices describing the location of the value. Strings address object keys; integers address array indices. |
| `default` | any | no | Fallback value returned when the path does not exist. |

## Outputs

| Field | Type | Description |
| ----- | ---- | ----------- |
| `value` | any | Value found at the requested path or the provided default. |
| `found` | boolean | Indicates whether the value existed in the original object. |

Implementations must not mutate the input object. If the path is empty, the contract returns the whole object.
