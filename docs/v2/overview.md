# LCOD v2 – System Overview

```mermaid
digraph G {
  rankdir=LR;
  subgraph cluster_runtime {
    label="Runtime";
    style=rounded;
    "Compose Engine" -> "Flow Blocks";
    "Flow Blocks" -> "Slots";
    "Compose Engine" -> "Scope Lookup";
  }

  subgraph cluster_resolver {
    label="Resolver";
    style=rounded;
    "Resolver Pipeline" -> "Catalogue Loader";
    "Resolver Pipeline" -> "Dependency Graph";
  }

  subgraph cluster_tooling {
    label="Tooling";
    style=rounded;
    "Spec Toolkit" -> "Testkit";
    "Spec Toolkit" -> "Component Docs";
  }

  "Runtime" -> "Resolver" [label="manifest lookup"];
  "Resolver" -> "Tooling" [label="catalogue exports"];
  "Tooling" -> "Runtime" [label="lcp manifests"];
}
```

- **Runtime**: run-compose execution, slots/scopes, kernel bridges.
- **Resolver**: component lookup, manifests, dependency graph.
- **Tooling**: spec/testkit/doc generators feeding runtime/resolver.

Use the subsystem docs to dive deeper.
