# Roadmap — lcod-spec

## M0 — Core format

Goal: Ship the minimal spec to describe, validate and distribute a single component package.

Tickets:
- [ ] Create `schema/` and draft `schema/lcp.schema.json` covering:
  - [ ] Identity fields: `schemaVersion`, `id` (URI `lcod://ns/name@semver`), `name`, `namespace`, `version` (SemVer), `kind` enum (`function|axiom|ui|workflow`)
  - [ ] `summary`, `docs` section (`readme`, `logo`)
  - [ ] `tool` section (`name`, `description`, `inputSchema`, `outputSchema`)
  - [ ] `hints` (`timeoutMs`, `retries`, `idempotent`, `pure`)
  - [ ] `deps` (`requires` array of canonical IDs)
  - [ ] `implMatrix` (languages list, optional targets)
  - [ ] Optional `ui` section (`kind`, `propsSchema`, `slots`)
  - [ ] Referential integrity (schemas exist, enums validated)
- [ ] Document folder conventions in `docs/structure.md`:
  - [ ] `impl/<lang>/` with `meta.toml`, `deps.json`, targets (e.g. `node18/`)
  - [ ] `schema/` for input/output/props JSON Schemas
  - [ ] `tests/unit/*.json` for declarative tests and axiom mocks
  - [ ] `assets/`, `doc_assets/`, optional `index.json`
- [ ] Define guidance for tool input/output schemas (`docs/schemas.md`) with examples
- [ ] Add reference examples in `examples/`:
  - [ ] `core/http_get` (axiom wrapper shape, docs only)
  - [ ] `demo/my_weather` (composite descriptor + sample compose.json skeleton)
- [ ] Add conformance check script (README instructions) to validate examples against `lcp.schema.json`

## M1 — Composition & tests
- Specify `compose.json` (sequential by default, `$.path` lookups, `${var}` interpolation)
- Specify test format (inputs/expected + axiom mocks)
- Document policies & hints (timeout, retry, cache, idempotence)

## M2 — Distribution & security
- `.lcpkg` archive format (+ integrity manifest)
- Resolution lockfile (`lcp.lock`)
- Annexes: UI conventions (`[ui]`), AsyncAPI/CloudEvents (events)
