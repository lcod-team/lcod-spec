# lcod://tooling/value/clone@0.1.0

Return a deep copy of the provided JSON value.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `value` | any | No | Value to clone. Defaults to `null`. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `value` | any | Independent copy of the provided value. |

## Notes

Delegates to `lcod://contract/core/value/clone@1` so kernels perform the
clone in their native runtime.
