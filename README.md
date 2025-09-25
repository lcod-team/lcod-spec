# lcod-spec

Specification for **LCOD Component Package (LCP)** and implementation conventions.

- Canonical descriptor: `lcp.toml`
- Call signatures: MCP-style tools with JSON Schema `inputSchema` / `outputSchema`
- Composition: explicit `compose` operator (bindings `in`/`out`)
- Declarative unit tests (JSON) with axiom mocks
- Component folder layout (impl/*, tests/*, assets/*)

See [OVERVIEW.md](OVERVIEW.md) for the ecosystem overview.

Spec docs

- [docs/id-and-versioning.md](docs/id-and-versioning.md) — Identity and versioning
- [docs/namespaces.md](docs/namespaces.md) — Namespace policy
- [docs/structure.md](docs/structure.md) — Package structure conventions
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
- [docs/lockfile.md](docs/lockfile.md) — Lockfile (`lcp.lock`) structure and lifecycle
- [docs/resolver.md](docs/resolver.md) — Resolver composite and required axioms
- [docs/core-contracts.md](docs/core-contracts.md) — Core infrastructure contracts (filesystem, HTTP, Git, parsing, hashing)
- [docs/core-streams.md](docs/core-streams.md) — Stream handles and chunked transfer contracts
- [docs/packaging.md](docs/packaging.md) — Package archive (`.lcpkg`) format
- [docs/guide-humans.md](docs/guide-humans.md) — Quick orientation for contributors
- [docs/guide-ai.md](docs/guide-ai.md) — Instructions for AI assistants

Quick validation

```
npm install
npm run validate
```

The validator parses `lcp.toml` with @iarna/toml, validates the descriptor against `schema/lcp.schema.json` (Ajv 2020), and ensures referenced schemas/doc files exist for all examples.
