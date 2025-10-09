# Registry Scope Tooling (`tooling/registry/scope@1`)

`tooling/registry/scope@1` provides a portable way to open an isolated component registry for the duration of a compose block. It mirrors the JVM classloader pattern: pushes a child registry, runs the requested steps, then restores the parent registry automatically. This prevents sibling compositions (or untrusted helpers) from overriding shared components while still enabling hot reload and local overrides.

## Motivation

- **Isolation** – keep flow-scoped helpers private without affecting the platform catalogue.
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

- If `components` is provided, kernels register each helper under an ephemeral scope. Inline `compose` entries are supported today; kernels treat each snippet as a miniature component and execute it when called. Inline `manifest` fragments remain a future extension.
- `bindings` applies only within the scope; the mapping is discarded when leaving it.
- Omitting both `components` and `bindings` simply isolates the scope while running the children.

## Compose shape

```yaml
compose:
  - call: tooling/registry/scope@1
    in:
      id: "flow-alpha"
      components:
        - id: lcod://flow-alpha/internal/cache@0.1.0
          compose:
            - call: lcod://axiom/fs/read-file@1
              in:
                path: $.cachePath
    children:
      - call: flow-alpha/internal/cache@1
```

Any component or binding registered inside the scope is available to child steps, but not to the parent scope.

## Kernel expectations

- Provide a native implementation of `tooling/registry/scope@1` that pushes/pops a registry layer even if `components`/`bindings` are empty.
- Guard against unbalanced scopes: the implementation must always pop in a `finally` block to prevent leaks.
- Ignore `components`/`bindings` fields that the kernel does not yet support, but emit a warning so hosts can detect missing functionality.
- Propagate the optional `id` (or a generated token) to structured logs via `lcod://contract/tooling/log@1` once an implementation is bound.

## Hierarchical scopes example

`tooling/registry/scope@1` can be nested to model higher-level concepts (servers, environments, projects) without hard-coding them in the kernel. A simplified layout:

```yaml
compose:
  - call: tooling/registry/scope@1  # server scope
    in:
      id: server
    children:
      - call: tooling/registry/scope@1  # environment: dev
        in:
          id: env-dev
        children:
          - call: tooling/registry/scope@1  # project A (dev bindings)
            in:
              id: projectA-dev
              bindings:
                lcod://contract/http/handler@1: lcod://impl/projectA/dev/http@1
            children:
              - call: projectA/http_app@1
          - call: tooling/registry/scope@1  # project B (dev bindings)
            in:
              id: projectB-dev
            children:
              - call: projectB/http_app@1
      - call: tooling/registry/scope@1  # environment: prod
        in:
          id: env-prod
        children:
          - call: tooling/registry/scope@1
            in:
              id: projectA-prod
              bindings:
                lcod://contract/http/handler@1: lcod://impl/projectA/prod/http@1
            children:
              - call: projectA/http_app@1
```

Each scope inherits registered helpers and bindings from its parent, so hosts can layer overrides cleanly (`project → environment → server`) while keeping the kernel ignorant of those semantics.

## Test plan (shared fixtures à venir)

1. Inline helper registered inside the scope is visible to children but missing outside.
2. Contract binding overrides (`bindings`) applied inside the scope revert afterward.
3. Nested scope: inner helpers do not leak to the outer scope.
4. Error handling: exceptions raised inside the scope still pop the registry.

Fixtures covering these scenarios will be added to `lcod-spec/tests/spec` once the kernels ship support.
