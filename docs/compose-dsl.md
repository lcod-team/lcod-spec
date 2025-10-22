# Compose DSL

Composite LCOD components describe their control flow in `compose.yaml`. The file contains a top-level `compose` array of **steps**. Steps run sequentially unless a flow block (e.g. foreach, if, try/catch) alters the control flow.

```yaml
compose:
  - call: lcod://contract/data/fetch@1
    in:
      url: $.endpoint
    out:
      body: raw
```

Each step is expressed as a YAML mapping with the fields described below.

## `call` (required)
Canonical identifier of the component or flow block to execute. Use the same format as in `lcp.toml` (`lcod://namespace/path/name@version`). The callee can be:
- a contract (`lcod://contract/...`), resolved to an implementation by the kernel;
- an implementation (`lcod://impl/...`);
- a flow operator (`lcod://flow/...`).

## `in`
Optional object mapping callee parameters to **bindings**. A binding can be:
- a literal (number, boolean, string, object or array);
- an expression referencing the current scope, using the same syntax as `docs/dsl-slots.md`:
  - `$.foo` — read value exposed by previous steps through `out`;
  - `$slot.item` — variable injected by the parent slot (e.g. foreach loop provides `item` and `index`);
  - `$env.*`, `$globals.*`, `$run.*` — reserved scopes for hosts/resolvers.

Bindings are evaluated before invoking the callee; missing bindings use the callee’s default input schema semantics.

### Sugar shortcuts
To keep large compositions readable, the DSL accepts a few shortcuts that expand to the equivalent explicit bindings:

- **Identity** — use `=` to forward the homonymous key from the current scope. Example: `in: { payload: '=' }` is shorthand for `in: { payload: $.payload }`.
- **Optional keys** — append `?` to a top-level key to mark it optional. If the referenced value is absent, the entry is omitted instead of passing `null`.
- **Spreads** — prefix a key with `...` to spread another object into the binding. For instance, `in: { ...params: $.request }` copies every property from `$.request` into the step input. Spreads can target arrays too when the callee expects a list of mappings.

These sugars are purely syntactic; engines expand them before running the compose file. Authors can mix sugars with explicit bindings in the same mapping.

## `out`
Optional object mapping names exported to the current scope (`$`) to fields returned by the callee. Example:

```yaml
call: lcod://impl/json/parse@1
in:
  text: $.raw
out:
  payload: data
```

After the step completes, subsequent steps may read `$.payload`.

## `slots`
Declares nested steps for the slots exposed by the callee. The canonical key is
`slots`; the legacy alias `children` is still accepted for backward compatibility
but new compositions should prefer `slots`.

- **Single-slot shorthand** — supply an array: `"slots": [ { ... }, { ... } ]`.
  The array is interpreted as the default slot named `body`.
- **Named slots** — supply an object mapping slot names to arrays:

```yaml
call: lcod://flow/if@1
in:
  cond: $.ok
slots:
  then:
    - call: lcod://impl/send@1
      in:
        payload: $.value
  else:
    - call: lcod://impl/log@1
      in:
        message: Fallback
```

Nested slots form their own lexical scope. The kernel injects slot variables under
`$slot.*` (e.g. foreach provides `{ item, index }`). Implementations can also
invoke child slots from native code via `ctx.runSlot(name, localState, slotVars)`.

## `collectPath`
Optional string evaluated after the step resolves. It reads from the result of the step (or slot state) and appends the value to a list managed by the callee. Currently used by `lcod://flow/foreach@1` to gather loop results. The path is evaluated against `{ $: stepResult, $slot: currentSlotVars }` using dot notation.

## Execution state and scopes
- Steps run sequentially, accumulating state in the `$` scope.
- When a step throws, control bubbles up until caught by a `flow/try@1` parent; otherwise the composition stops with an error.
- Flow blocks may capture/rewrite the current state (e.g. foreach executes the body for each item, exposing loop-scoped outputs only within each iteration).

## Example: foreach with continue/break

```yaml
compose:
  - call: lcod://flow/foreach@1
    in:
      list: $.numbers
    slots:
      body:
        - call: lcod://impl/is_even@1
          in:
            value: $slot.item
          out:
            even: ok
        - call: lcod://flow/if@1
          in:
            cond: $.even
          slots:
            then:
              - call: lcod://flow/continue@1
        - call: lcod://impl/echo@1
          in:
            value: $slot.item
          out:
            val: val
    collectPath: $.val
    out:
      results: selected
```

The foreach body runs for each item, exposes `$slot.item`, and pushes each echoed value through `collectPath`. After completion, `$.selected` contains the collected list.

## Authoring checklist
- Ensure every step declares `call`.
- Use `out` to expose only the fields needed later; avoid leaking entire step outputs.
- Prefer named slot objects for multi-slot flow blocks (`if`, `try`, `parallel`).
- Keep literal bindings simple; move complex logic to dedicated components.

More examples are available under `examples/flow/*`. Slots and scope details are covered in `docs/dsl-slots.md`.
