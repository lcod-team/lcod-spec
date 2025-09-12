# Roadmap — lcod-spec

## M0 — Core format
- Define `lcp.toml` (TOML only) + descriptor JSON Schema (`schema/lcp.schema.json`)
- Define generic JSON Schemas for tool input/output
- Folder conventions (impl/<lang>/meta.toml, deps.json, tests/unit/*.json)

## M1 — Composition & tests
- Specify `compose.json` (sequential by default, `$.path` lookups, `${var}` interpolation)
- Specify test format (inputs/expected + axiom mocks)
- Document policies & hints (timeout, retry, cache, idempotence)

## M2 — Distribution & security
- `.lcpkg` archive format (+ integrity manifest)
- Resolution lockfile (`lcp.lock`)
- Annexes: UI conventions (`[ui]`), AsyncAPI/CloudEvents (events)
