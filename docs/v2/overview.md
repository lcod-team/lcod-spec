# LCOD v2 – System Overview

```mermaid
flowchart LR
  subgraph Runtime
    direction TB
    CE[Compose Engine] --> FB[Flow Blocks]
    FB --> SL[Slots]
    CE --> SC[Scope Lookup]
  end

  subgraph Resolver
    direction TB
    RP[Resolver Pipeline] --> CL[Catalogue Loader]
    RP --> DG[Dependency Graph]
  end

  subgraph Tooling
    direction TB
    ST[Spec Toolkit] --> TK[Testkit]
    ST --> CD[Component Docs]
  end

  Runtime -->|manifest lookup| Resolver
  Resolver -->|catalogue exports| Tooling
  Tooling -->|lcp manifests| Runtime
```

- **Runtime**: run-compose execution, slots/scopes, kernel bridges.
- **Resolver**: component lookup, manifests, dependency graph.
- **Tooling**: spec/testkit/doc generators feeding runtime/resolver.

Use the subsystem docs to dive deeper.
