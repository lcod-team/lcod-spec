# AGENT — lcod-spec

## Mission
Write the LCP specification (descriptor, schemas, conventions) with runnable examples.

## Constraints
- TOML is the single source of truth for `lcp.toml`.
- JSON Schemas must be exhaustive and testable.
- Examples should be minimal but complete.

## Definition of Done
- `schema/lcp.schema.json` validated
- Documentation in `docs/` + top-level README
- Valid examples in `examples/`
- Shared fixtures in `tests/spec` kept up to date and runnable by each kernel
