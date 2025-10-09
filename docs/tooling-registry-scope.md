# Registry Scope Tooling (`tooling/registry/scope@1`)

`tooling/registry/scope@1` provides a portable way to open an isolated component registry for the duration of a compose block. It mirrors the JVM classloader pattern: pushes a child registry, runs the requested steps, then restores the parent registry automatically. This prevents unrelated projects (or untrusted helpers) from overriding shared components while still enabling hot reload and local overrides.

## Motivation

- **Isolation** – keep project-scoped helpers private without affecting the platform catalogue.
- **Hot reload** – allow temporary overrides during development without polluting the global registry.
- **Portability** – define the behaviour once in the spec so every kernel replicates the same semantics.

## Behaviour

1. Push a new registry scope that inherits from the current scope.
2. Optionally register additional components/aliases in that scope.
3. Execute the `children` slot inside the new scope.
4. Pop the scope automatically on completion (success or error).

During the scope, component resolution proceeds as:

```
child scope → parent scope → ... → platform scope
```

Any components registered inside the child scope disappear once it is popped.

> **Current status (Oct 2025):** The Node and Rust kernels support scoped contract bindings via this tooling component. Inline component registration (`components`) is ignored for now with a warning; future milestones will extend the scope to handle ephemeral helper registration.

## Input schema (`tooling/registry/scope@1`)

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "Optional identifier for tracing/diagnostics."
    },
    "components": {
      "type": "array",
      "description": "Inline components to register temporarily.",
      "items": {
        "type": "object",
        "required": ["id"],
        "properties": {
          "id": { "type": "string" },
          "manifest": {
            "type": "object",
            "description": "Partial LCP descriptor for inline registration (optional)."
          },
          "compose": {
            "type": "array",
            "description": "Inline compose steps for helper components."
          }
        },
        "oneOf": [
          { "required": ["manifest"] },
          { "required": ["compose"] }
        ]
      }
    },
    "bindings": {
      "type": "object",
      "description": "Contract-to-implementation bindings scoped to this registry.",
      "additionalProperties": { "type": "string" }
    }
  },
  "additionalProperties": false
}
```

- If `components` is provided, kernels should register each helper under `scope="ephemeral"` (private to this scope). Implementations may materialise the helpers via inline compose or manifest fragments.
- `bindings` applies only within the scope; the mapping is discarded when leaving it.
- Omitting both `components` and `bindings` simply isolates the scope while running the children.

## Compose shape

```yaml
compose:
  - call: tooling/registry/scope@1
    in:
      id: "project-alpha"
      components:
        - id: lcod://project-alpha/internal/cache@0.1.0
          compose:
            - call: lcod://axiom/fs/read-file@1
              in:
                path: $.cachePath
    children:
      - call: project-alpha/internal/cache@1
```

Any component or binding registered inside the scope is available to child steps, but not to the parent scope.

## Kernel expectations

- Provide a native implementation of `tooling/registry/scope@1` that pushes/pops a registry layer even if `components`/`bindings` are empty.
- Guard against unbalanced scopes: the implementation must always pop in a `finally` block to prevent leaks.
- Ignore `components`/`bindings` fields that the kernel does not yet support, but emit a warning so hosts can detect missing functionality.
- Propagate the optional `id` (or a generated token) to structured logs once `lcod://tooling/log@1` is available.

## Test plan (shared fixtures à venir)

1. Inline helper registered inside the scope is visible to children but missing outside.
2. Contract binding overrides (`bindings`) applied inside the scope revert afterward.
3. Nested scope: inner helpers do not leak to the outer scope.
4. Error handling: exceptions raised inside the scope still pop the registry.

Fixtures covering these scenarios will be added to `lcod-spec/tests/spec` once the kernels ship support.
