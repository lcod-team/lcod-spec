# Standard Library Rationalisation

LCOD leans on small, composable helpers. Many early compositions rely on
`tooling/script@1` for tasks that would be better expressed as declarative
blocks. Milestone **M8** introduces a standard library of primitives that makes
object, collection, and string manipulation predictable across kernels while
remaining portable.

This document captures the shared contract surface, behavioural rules, and the
guidelines kernels must follow when implementing the primitives.

## Goals

- Provide first-class contracts for common tasks (object access, array updates,
  string formatting, JSON encoding/decoding) so that compose authors can avoid
  ad-hoc scripts.
- Keep each primitive synchronous, deterministic, and side-effect free so
  kernels can implement them as lightweight axioms.
- Encourage reuse: all higher-level helpers (for example registry tooling or
  HTTP demos) should rely on these primitives instead of embedding snippets of
  JavaScript.

## Naming scheme

The primitives live under the `lcod://contract/core/*` namespace. Each contract
starts at version `@1`; future evolution happens through new versions that keep
the old ones available for backward compatibility.

```
lcod://contract/core/object/get@1
lcod://contract/core/object/set@1
lcod://contract/core/object/merge@1
lcod://contract/core/array/push@1
lcod://contract/core/array/append@1        # shorthand for concatenation
lcod://contract/core/string/format@1
lcod://contract/core/json/encode@1
lcod://contract/core/json/decode@1
```

> The exact set can grow after M8-01; the first iteration focuses on the
> smallest building blocks required to replace the common script snippets found
> in the resolver, registry tooling, and demo services.

## Contract expectations

The following table summarises the required behaviour. Detailed schemas are
defined in the contract packages; kernels must produce the same observable
results when implementing the primitives.

| Contract | Purpose | Key rules |
|----------|---------|-----------|
| `core/object/get@1` | Extract a value from an object by path. | Accepts `path` as an array of keys; returns `null` when the key does not exist; never throws for missing segments. |
| `core/object/set@1` | Assign a value at a path. | Creates intermediate objects when absent; returns a shallow copy without mutating the input. |
| `core/object/merge@1` | Merge two objects. | Performs a shallow merge by default; optional `deep` flag enables recursive merge; right-hand side wins on conflicts. |
| `core/array/push@1` | Append an item to an array. | Returns a new array with the extra element. |
| `core/array/append@1` | Concatenate arrays. | Returns a new array; treats `null`/`undefined` as empty arrays; accepts a single element or an array as `item`. |
| `core/string/format@1` | Format a string template. | Uses named placeholders (`{name}`); missing keys default to `""`; supports optional formatters later. |
| `core/json/encode@1` | Serialize to JSON. | Deterministic encoding; supports optional `space` and `sortKeys`. |
| `core/json/decode@1` | Parse JSON text. | Returns structured values; emits a structured error with `code="JSON_PARSE"` on invalid input. |

### Error handling

- All operations surface predictable errors instead of throwing runtime
  exceptions. Schemas define explicit `error` fields (or status booleans) and
  implementations must honour them rather than raising host exceptions.
- Implementations must treat `undefined` and absent fields as equivalent unless
  stated otherwise. This guarantees identical behaviour across kernels.

### Determinism

- No primitive reads from external state or modifies input arguments. The
  outputs depend solely on the inputs provided in the contract call.
- Kernels may cache helper functions internally for performance, but must not
  leak state between invocations.

## Authoring guidance

- Prefer these primitives whenever you need to manipulate JSON-like data.
- When a flow requires multiple operations, chain the primitives instead of
  reaching for `tooling/script@1`. For example, use `core/object/get@1`
  followed by `core/string/format@1` rather than writing a script that performs
  both.
- Document compound patterns in higher-level helpers (for instance one that
  builds query parameters) so they can evolve independently of the primitives.

## Kernel implementation requirements

1. Register the primitives as axioms with deterministic behaviour.
2. Ensure the implementations are available both in interactive mode and in
   the runtime bundle (Node, Rust, and upcoming substrates).
3. Mirror the contract schema exactly; differences in optional fields should be
   treated as bugs.
4. Provide unit tests that consume the spec fixtures once published, plus
   kernel-side smoke tests where appropriate (for example string formatting
   edge cases).

## Migration plan

1. **Spec (M8-01)** — land the new contracts, schemas, fixtures, and this
   document. Update the roadmap once merged.
2. **Kernels (M8-02)** — implement the axioms in `lcod-kernel-js` and
   `lcod-kernel-rs`, adding coverage to the respective test suites.
3. **Components (M8-03)** — publish higher-level helpers in the component
   catalogue (new repository `lcod-components`).
4. **Refactor (M8-04)** — replace ad-hoc scripts inside spec/tooling/resolver
   with the primitives. Track regressions via shared fixtures.

Keeping the standard library small and focused helps retain the KISS
constraint: each primitive does one thing well, and larger workflows are built
by composing them.
