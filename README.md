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

Quick validation

- Install Node.js, then run `make validate` to check example packages against minimal M0 rules (IDs, file existence, JSON syntax).
