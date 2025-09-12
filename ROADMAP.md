# Roadmap — lcod-spec

## M0 — Core format

Goal: Ship the minimal spec to describe, validate and distribute a single component package.

Tickets:
- [ ] M0-01 Finalize `schema/lcp.schema.json` with `$defs`, descriptions, examples
- [ ] M0-02 Document ID and versioning (`docs/id-and-versioning.md`) and link from README
- [ ] M0-03 Namespace policy (`docs/namespaces.md`) and link from README
- [ ] M0-04 Folder conventions (`docs/structure.md`) — done
- [ ] M0-05 Schema best practices (`docs/schemas.md`) — done
- [ ] M0-06 Reference examples (`examples/core/http_get`, `examples/demo/my_weather`) — done
- [ ] M0-07 Minimal validator (`scripts/validate.js`, `make validate`) — done
- [ ] M0-08 Strict validator with Ajv + TOML (CI uses dev deps) — partial (falls back locally)
- [ ] M0-09 CI workflow `.github/workflows/validate.yml` — done
- [ ] M0-10 Minimal UI example (`examples/ui/hello_button`) — done
- [ ] M0-11 Guide “Create a new component” (`docs/create-component.md`) — done

## M1 — Composition & tests
- Specify `compose.json` (sequential by default, `$.path` lookups, `${var}` interpolation)
- Specify test format (inputs/expected + axiom mocks)
- Document policies & hints (timeout, retry, cache, idempotence)

## M2 — Distribution & security
- `.lcpkg` archive format (+ integrity manifest)
- Resolution lockfile (`lcp.lock`)
- Annexes: UI conventions (`[ui]`), AsyncAPI/CloudEvents (events)
