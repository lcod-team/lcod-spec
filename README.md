# lcod-spec

Specification for **LCOD Component Package (LCP)** and implementation conventions.

- Canonical descriptor: `lcp.toml`
- Call signatures: MCP-style tools with JSON Schema `inputSchema` / `outputSchema`
- Composition: explicit `compose` operator (bindings `in`/`out`)
- Declarative unit tests (JSON) with axiom mocks
- Component folder layout (impl/*, tests/*, assets/*)
- Documentation is written for humans (IDE inspectors) **and** machines (RAG index).
  Keep parameter descriptions concise and reference the JSON schemas to avoid
  duplication.
- HTTP hosting contracts (`env/http_host`, `project/http_app`, `http/api_route`)
  are documented in `docs/http-hosting.md` with a reference example under
  `examples/env/http_demo`.

See [OVERVIEW.md](OVERVIEW.md) for the ecosystem overview.

Shared specification fixtures live under `tests/spec`. They are portable compose-based tests executed by each kernel via the built-in runners (`npm run test:spec`, `cargo run --bin test_specs`, and the upcoming Gradle harness described in `docs/runtime-java.md`).

Spec docs

- [docs/id-and-versioning.md](docs/id-and-versioning.md) — Identity and versioning
- [docs/namespaces.md](docs/namespaces.md) — Namespace policy
- [docs/structure.md](docs/structure.md) — Package structure conventions
- [docs/workspaces.md](docs/workspaces.md) — Workspace layout, scope aliases and helper registration
- [docs/tooling-registry-scope.md](docs/tooling-registry-scope.md) — Registry scope tooling contract (`tooling/registry/scope@1`) and how it interacts with federated catalogues
- [docs/registry.md](docs/registry.md) — Federated registry format (catalogues, manifest pointers, resolver sources)
- [docs/schemas.md](docs/schemas.md) — Tool schema best practices
- [docs/create-component.md](docs/create-component.md) — Create a new component
- [docs/compose-dsl.md](docs/compose-dsl.md) — YAML DSL for `compose.yaml`
- [docs/flow-blocks.md](docs/flow-blocks.md) — Core flow operators (`if`, `foreach`, `parallel`)
- [docs/contracts-and-impls.md](docs/contracts-and-impls.md) — Contracts, implementations and bindings
- [docs/dsl-slots.md](docs/dsl-slots.md) — Slots, scopes and children
- [docs/errors.md](docs/errors.md) — try/catch/finally and throw
- [docs/streams.md](docs/streams.md) — Streams and chunked processing
- [docs/memory.md](docs/memory.md) — Memory and retention policies
- [docs/runtime-hints.md](docs/runtime-hints.md) — Execution hints (`timeout`, `retries`, `idempotent`, `pure`)
- [docs/quickstart.md](docs/quickstart.md) — Validate and run the demo packages locally
- [docs/tests.md](docs/tests.md) — Declarative test format
- [docs/runtime-rust.md](docs/runtime-rust.md) — Rust substrate blueprint and conformance harness
- [docs/runtime-java.md](docs/runtime-java.md) — Java substrate blueprint and parity plan
- [docs/lockfile.md](docs/lockfile.md) — Lockfile (`lcp.lock`) structure and lifecycle
- [docs/resolver.md](docs/resolver.md) — Resolver composite and required axioms
- [docs/mcp-authoring.md](docs/mcp-authoring.md) — MCP-assisted authoring contract and backend expectations
- [docs/release-workflow.md](docs/release-workflow.md) — Release workflow and maintainer checklist
- [docs/packaging-pipeline.md](docs/packaging-pipeline.md) — Assemble → Ship → Build packaging stages
- [docs/core-contracts.md](docs/core-contracts.md) — Core infrastructure contracts (filesystem, HTTP, Git, parsing, hashing)
- [docs/core-streams.md](docs/core-streams.md) — Stream handles and chunked transfer contracts
- [docs/packaging.md](docs/packaging.md) — Package archive (`.lcpkg`) format
- [docs/guide-humans.md](docs/guide-humans.md) — Quick orientation for contributors
- [docs/guide-ai.md](docs/guide-ai.md) — Instructions for AI assistants
- [docs/std-library-refactor.md](docs/std-library-refactor.md) — Standard library audit and refactor plan

Quick validation

```
npm install
npm run validate
```

The validator parses `lcp.toml` with @iarna/toml, validates the descriptor against `schema/lcp.schema.json` (Ajv 2020), and ensures referenced schemas/doc files exist for all examples.

Run a compose locally (for example a spec fixture) with the cross-platform helper:

```
npm run lcod-run -- --compose tests/spec/tooling_primitives/compose.yaml
```
On Windows set `LCOD_RUN_BIN` to the extracted `lcod-run.exe` shipped with the runtime bundle so the helper can invoke the correct binary.

Windows contributors should also disable automatic CRLF conversion and renormalise the worktree after pulling the `.gitattributes` file:

```
git config core.autocrlf false
git add --renormalize .
```
