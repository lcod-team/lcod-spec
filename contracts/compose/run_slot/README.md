<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://contract/compose/run_slot@1.0.0

Invoke a named slot within the current compose scope and return its result.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `slot` | string | Yes | Name of the slot to execute (e.g. target, then, else, body). |
| `state` | object | No | Custom state object to pass to the slot instead of the current scope. |
| `slotVars` | object | No | Additional slot variables injected into the child scope (mirrors flow slot_vars). |
| `optional` | boolean | No | When true, missing slots resolve to { ran: false } instead of throwing. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `result` | any | Value returned by the executed slot. |
| `ran` | boolean | False when the slot was missing and optional=true was set. |
| `error` | object | null | Structured error object when the slot raised. |

## Notes

This contract allows a compose to execute one of its own slots (or a slot from a
nested component) without relying on scripting. The host runtime forwards the
request to the same slot machinery that powers `flow/if`, `flow/foreach`, etc.

Typical usage:

```yaml
- call: lcod://contract/compose/run_slot@1
  in:
    slot: target
  out:
    result: targetResult
  slots:
    target:
      - call: lcod://impl/set@1
        in:
          result:
            value: $.input
```

By default the contract forwards the current scope (`$`) to the slot. When a
custom state is provided, it is cloned before execution so the slot can mutate
it freely. Optional `slotVars` mirror the values kernels pass to built-in flow
controls (phase, error, ...).

Runtimes SHOULD return the slot's output untouched in `result`. When the slot is
missing and the call is marked as `optional`, implementations may simply report
`ran = false` without raising an error.
