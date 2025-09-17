# lcod-spec

Specification for **LCOD Component Package (LCP)** and implementation conventions.

- Canonical descriptor: `lcp.toml`
- Call signatures: MCP-style tools with JSON Schema `inputSchema` / `outputSchema`
- Composition: explicit `compose` operator (bindings `in`/`out`)
- Declarative unit tests (JSON) with axiom mocks
- Component folder layout (impl/*, tests/*, assets/*)

See `OVERVIEW.md` for the ecosystem overview.

Spec docs

- docs/id-and-versioning.md — Identity and versioning
- docs/namespaces.md — Namespace policy
- docs/structure.md — Package structure conventions
- docs/schemas.md — Tool schema best practices
- docs/create-component.md — Create a new component
- docs/contracts-and-impls.md — Contracts, implementations and bindings
- docs/dsl-slots.md — Slots, scopes and children
- docs/errors.md — try/catch/finally and throw
- docs/streams.md — Streams and chunked processing
- docs/memory.md — Memory and retention policies

Quick validation

```
npm install
npm run validate
```

The validator parses `lcp.toml` with @iarna/toml, validates the descriptor against `schema/lcp.schema.json` (Ajv 2020), and ensures referenced schemas/doc files exist for all examples.
