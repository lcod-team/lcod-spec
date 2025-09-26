# Contract: tooling/script@1

Executes a short piece of JavaScript inside a sandboxed runtime. The contract
injects selected bindings from the input state and exposes a restricted `api`
object that allows the script to invoke other contracts (`api.call`) or
optionally run child slots (`api.runSlot`).

The script must export a function. When evaluated, the runtime wraps the source
code as `(<source>)` and invokes it with two arguments:

```js
({ input, state, meta }, api) => {
  // input  -> values resolved from the bindings
  // state  -> shallow copy of the contract input state
  // meta   -> optional metadata provided in the request
  // api    -> { call, runSlot, log }
}
```

The function can be synchronous or asynchronous. Its return value becomes the
contract output (typically an object that includes `success`, `result`,
`messages`, …). Throwing an error produces a failed execution with the error
message captured in `messages`.

## Initial state

The optional `input` field is deep-cloned and passed to the script as
`scope.state`. Kernels may extend the state before execution (for example by
injecting synthetic stream handles). Arbitrary metadata can be provided through
`meta`; it becomes `scope.meta` inside the script.

## Bindings

The `bindings` object maps variable names to descriptors. Each descriptor can
specify either:

- `path` — a JSON-path-like string (e.g. `$.value`, `$.user.name`) evaluated
  against the contract input; or
- `value` — a literal constant injected verbatim.
- `default` — optional fallback when `path` does not resolve.

Values resolved via `path` are deep-cloned so scripts cannot mutate the original
state.

## Streams

When the request provides a `streams` array, each entry describes a synthetic
stream that the runtime should register and inject at the given target path in
the initial state. This mirrors the facilities exposed by
`tooling/test_checker@1` so cross-runtime fixtures can reuse the same
recordings.

## API surface

- `api.call(id, args)` — invokes another contract via the host runtime. Returns
  a promise (Node) or direct value (Rust); scripts can `await` the promise.
- `api.runSlot(name, state)` — runs a named slot declared on the compose step.
  When the compose doesn’t provide any children, calling `runSlot` throws.
- `api.log(...values)` — appends values to the result’s `messages` array.

Host runtimes MUST enforce a timeout (`timeoutMs`, default 1000ms) and memory
limits to avoid runaway scripts.

## Example

```yaml
- call: lcod://tooling/script@1
  in:
    source: |
      async ({ input, api }) => {
        if (input.value > 2 && input.value < 7) {
          const echoed = await api.call('lcod://impl/echo@1', { value: input.value });
          return { success: true, result: echoed.val };
        }
        return { success: false, messages: ['value out of range'] };
      }
    bindings:
      input:
        path: $.value
  out:
    report: $
```

This contract is designed to be portable across all kernels. Each runtime is
responsible for providing a compliant sandbox and translating between JSON
values and the scripting engine’s native types.
