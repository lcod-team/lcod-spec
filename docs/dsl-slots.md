# DSL Slots and Scopes

- Default single slot: `children` (array of steps). When a block has one slot, `children` can be provided directly as an array.
- Multi-slot blocks: `children` is an object of slot names to arrays (e.g., `{ then: [...], else: [...] }`).
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
- If: `{ "call": "lcod://flow/if@1", "in": { "cond": "$.ok" }, "children": { "then": [...], "else": [...] } }`
- Foreach: `{ "call": "lcod://flow/foreach@1", "in": { "list": "$.items" }, "children": { "body": [...] } }`
- Parallel: `{ "call": "lcod://flow/parallel@1", "children": { "tasks": [ stepA, stepB ] } }`
