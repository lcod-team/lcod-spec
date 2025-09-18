# Errors: try/catch/finally and throw

LCOD expresses synchronous error handling with dedicated flow blocks. Errors propagate as structured objects so that hosts can render consistent diagnostics.

## Error shape

All errors bubble up as JSON objects with the following structure:

```json
{
  "code": "string",      // optional, human-readable identifier
  "message": "string",   // required message
  "data": { ... }         // optional, implementation-defined payload
}
```

Implementations may throw native errors; the kernel normalizes them using the rules above (`code` defaults to `unexpected_error`).

## `lcod://flow/throw@1`

Raises an error immediately.

### Inputs
- `code` (optional string)
- `message` (required string)
- `data` (optional object)

The block never returns. It throws the normalized error which can be caught by an enclosing `flow/try@1`.

## `lcod://flow/try@1`

Executes the `children` slot and provides hooks for `catch` and `finally`.

```json
{
  "call": "lcod://flow/try@1",
  "children": {
    "children": [ ... ],   // main body (required)
    "catch": [ ... ],      // optional catch block
    "finally": [ ... ]     // optional finally block
  }
}
```

### Slots
- `children` — required. Runs first; may expose state via `out`.
- `catch` — optional. Runs only when the body throws. Receives `$slot.error` (normalized error). The catch slot may expose new state via `out` or rethrow.
- `finally` — optional. Runs after either the body or catch complete. Executed even if `catch` throws; its result is ignored (state after try/catch is preserved).

### Behaviour
1. Run `children`. If it completes successfully, skip `catch`.
2. If `children` throws, normalize the error and execute the `catch` slot. The slot scope receives:
   - `$slot.error` — normalized error
   - `$slot.phase = "catch"`
3. After either `children` or `catch` finish (whether success or error), execute `finally` if provided. `$slot.phase` is set to `"finally"`.
4. If `catch` handles the error (returns without throwing), the try step is considered successful and may expose outputs via `out` mappings. If `catch` rethrows (via `flow/throw` or by propagating the error), the error bubbles up after `finally` runs.

### Outputs
State changes from whichever slot completed last (`children` or `catch`). Use `out` on the `flow/try` step to expose aggregate values.

## Example

```json
{
  "compose": [
    {
      "call": "lcod://flow/try@1",
      "children": {
        "children": [ { "call": "lcod://impl/might_fail@1" } ],
        "catch": [
          { "call": "lcod://impl/log@1", "in": { "message": "$slot.error.message" } },
          { "call": "lcod://impl/recover@1", "out": { "value": "result" } }
        ],
        "finally": [ { "call": "lcod://impl/cleanup@1" } ]
      },
      "out": { "result": "value" }
    }
  ]
}
```

The example logs and recovers from failures, ensuring cleanup runs regardless of success.
