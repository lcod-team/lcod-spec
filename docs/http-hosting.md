# HTTP Hosting Components

This document defines the contracts used to describe HTTP environments in LCOD.
They enable IDEs and runtimes to assemble full web services from reusable
components.

## Overview

```
Environment (env/http_host)
└── Project (project/http_app)
    ├── Sequences slot (business logic)
    └── APIs slot (route descriptors)
```

An `env/http_host` component starts an HTTP server and executes the `projects`
slot to collect one or more HTTP projects. Each `project/http_app` component
returns the routes it exposes plus the sequence metadata required to run them.
Routes are declared with `http/api_route`.

## Contracts

### env/http_host@0.1.0
- Inputs: `host`, `port`, optional `basePath`, `metadata`.
- Slots: `projects` (list of `project/http_app` instances).
- Outputs: `url`, `routes`, resolved project descriptors.

### project/http_app@0.1.0
- Inputs: `name`, `basePath`, optional `metadata`.
- Slots: `sequences`, `apis`.
- Outputs: `routes` (array of HTTP route descriptors), `sequences` (handlers),
  `project` metadata.

### http/api_route@0.1.0
- Inputs: `method`, `path`, `sequenceId`, optional description/middleware.
- Output: canonical `route` descriptor.

## Example compose

See `examples/env/http_demo/compose.yaml` for a full example that wires a
catalog project into an HTTP host.

## Next steps

- Node, Rust, and (once parity lands) Java kernels will implement these contracts
  to provide a runnable HTTP demo service (`M6-02`, `M6-03`, `KJ-12`).
- The resolver will be able to surface HTTP projects from the registry using the
  same descriptors (`M6-04`, `M6-05`).
