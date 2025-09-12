# lcod-spec

Specification for **LCOD Component Package (LCP)** and implementation conventions.

- Canonical descriptor: `lcp.toml`
- Call signatures: MCP-style tools with JSON Schema `inputSchema` / `outputSchema`
- Composition: explicit `compose` operator (bindings `in`/`out`)
- Declarative unit tests (JSON) with axiom mocks
- Component folder layout (impl/*, tests/*, assets/*)

See `OVERVIEW.md` for the ecosystem overview, and `docs/` and `examples/` for reference components.
