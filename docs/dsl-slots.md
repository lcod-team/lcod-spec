# DSL Slots and Scopes

- The canonical key is `slots`. Legacy `children` is still accepted and will be
  generated automatically for backward compatibility.
- Default single slot: `slots` may be provided directly as an array. The array
  targets the default slot (`body` for foreach, `tasks` for parallel, etc.).
- Multi-slot blocks: `slots` is an object of slot names to arrays (e.g.,
  `{ then: [...], else: [...] }`).
- Scopes and references:
  - `$` — run state (aliases created via `out`)
  - `$slot.*` — variables injected by the parent block (e.g., `item`, `index` for foreach; `error` for try)
  - `$env`, `$globals`, `$run` — environment variables, global symbols, run metadata
- `let`: injects local variables into a slot scope for its children.

### Collecting data from slots
- `collectPath` on flow blocks resolves against `{ $: childState, $slot: slotVars }`.
- Use `$slot.*` inside `collectPath` to access loop metadata (e.g., indices) without mutating state.
- Example: `collectPath: "$slot.index"` gathers iteration indices (see `test/flow.foreach.test.js`).

## Examples
- If: `{ "call": "lcod://flow/if@1", "in": { "cond": "$.ok" }, "slots": { "then": [...], "else": [...] } }`
- Foreach: `{ "call": "lcod://flow/foreach@1", "in": { "list": "$.items" }, "slots": { "body": [...] } }`
- Parallel: `{ "call": "lcod://flow/parallel@1", "slots": { "tasks": [ stepA, stepB ] } }`
