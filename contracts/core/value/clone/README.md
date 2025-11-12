# Value Clone (`lcod://contract/core/value/clone@1`)

Produces a deep copy of the provided JSON value. Kernels implement this
contract natively so that arrays/objects are duplicated without sharing
references.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `value` | any | No | Value to clone (defaults to `null`). |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `value` | any | Clone of the provided value. |
