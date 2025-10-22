# Flow Blocks

Flow operators are reusable components that manipulate control flow in `compose.yaml`. They are versioned like any other component (e.g. `lcod://flow/if@1`) and expose slots for nested steps. This document describes the semantics of the core M1 flow blocks.

## Common behaviour
- Flow blocks are invoked like normal steps: they accept `in`, expose outputs via `out`, and may define `collectPath` semantics.
- Each block receives a `slots` object describing its slots. Missing slots default to empty arrays. The legacy alias `children` is still accepted while older kernels are phased out.
- Errors thrown inside slots bubble up unless the block handles them explicitly (e.g. `flow/try`).

## `lcod://flow/if@1`

Conditional execution with two slots: `then` and `else`.

### Inputs
- `cond` (required, boolean coercible)

### Slots
```
slots: {
  "then": [...],  // executed when cond is truthy
  "else": [...]   // executed when cond is falsy (optional)
}
```
`else` defaults to an empty list when omitted.

### Outputs
The block returns the merged state produced by the executed slot (everything exposed via `out` inside the slot). Additional fields may be declared via its own `out` mapping.

## `lcod://flow/foreach@1`

Iterates over an array or async stream and optionally collects a result.

### Inputs
- `list` — array to iterate (required unless `stream` provided)
- `stream` — AsyncIterable alternative to `list`
- `parallelism` (optional, number) — hint for maximum concurrent iterations (future use)

### Slots
```
slots: {
  "body":  [...],  // required, executed for each item
  "else":  [...]   // optional, executed once when the sequence is empty
}
```
For each iteration the slot scope receives:
- `$slot.item` — current element
- `$slot.index` — zero-based index

### Control blocks
`flow/continue@1` and `flow/break@1` can be invoked inside the body to skip or stop iteration. They signal using internal errors (`$signal = 'continue' | 'break'`).

### Collection
If `collectPath` is set, its value is evaluated against `{ $: iterationState, $slot }` and appended to an internal array. When the sequence is empty, `collectPath` is evaluated against the result of the `else` slot (with `$slot.index = -1`). The collected array is returned under `results` unless overridden by `out`.

## `lcod://flow/parallel@1`

Runs child tasks concurrently and waits for all of them to complete.

### Inputs
- `tasks` (optional) — array of inputs provided to each slot run (usually mapped via `in`)
- `mode` (optional, string) — future extension (e.g. `all`, `race`)
- `parallelism` (optional, number) — maximum number of concurrent tasks (default: unbounded)

### Slots
```
slots: {
  "tasks": [ ... ]  // required, executed once per item in tasks array
}
```
The slot receives `$slot.index` and `$slot.item` (the element from `tasks`). Each execution has an isolated scope. Results may be combined via `collectPath` or explicit `out` structures.

### Outputs
The block returns an array of collected values (when `collectPath` provided) or merges explicit outputs exposed by the slot runs. Errors from any task fail the whole block unless handled internally.

## Try/Catch/Finally (preview)
`lcod://flow/try@1` and `lcod://flow/throw@1` are specified in `docs/errors.md` (see issue M1-03). They follow the same slot model with `slots.body`, `slots.catch`, `slots.finally`.

## Referencing flow blocks in lcp.toml
Flow blocks are regular components published under the `flow/` namespace. Composite packages include them in `deps.requires` using major versions (e.g. `lcod://flow/foreach@1`). Hosts may replace versions or implementations through resolver bindings.

## Examples
- `examples/flow/foreach_demo` — basic foreach usage
- `examples/flow/foreach_ctrl_demo` — continue/break controls and `collectPath`

Further guidance on slot variables and scope rules is available in `docs/dsl-slots.md` and the new `docs/compose-dsl.md`.
