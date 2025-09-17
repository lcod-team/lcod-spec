# Roadmap — lcod-spec

## M0 — Core format

Goal: Ship the minimal spec to describe, validate and distribute a single component package.

Tickets:
- [ ] M0-01 Finalize `schema/lcp.schema.json` with `$defs`, descriptions, examples
- [ ] M0-02 Add `kind="contract"` and optional `implements` to schema; document contracts vs implementations
- [ ] M0-03 Document ID and versioning (`docs/id-and-versioning.md`) and link from README — partial
- [ ] M0-04 Namespace policy (`docs/namespaces.md`) — include reserved roots: `contract/`, `impl/`, `axiom/`, `flow/` — partial
- [x] M0-05 Folder conventions (`docs/structure.md`)
- [x] M0-06 Schema best practices (`docs/schemas.md`)
- [x] M0-07 Minimal validator (`scripts/validate.cjs`, `make validate`)
- [ ] M0-08 Strict validator with Ajv + TOML (CI uses dev deps) — partial (falls back locally)
- [x] M0-09 CI workflow `.github/workflows/validate.yml`
- [x] M0-10 Minimal UI example (`examples/ui/hello_button`)
- [x] M0-11 Guide “Create a new component” (`docs/create-component.md`)

## M1 — Composition & tests
- Specify `compose.json` with slots (`children` default, named multi‑slots), scopes (`$`, `$slot`, `$env`, `$globals`, `$run`)
- Flow blocks: `flow/if@1`, `flow/foreach@1` (array/stream + `collectPath` and `else`), `flow/parallel@1`
- Errors: `flow/try@1` (children/catch/finally), `flow/throw@1`; error structure (code/message/data)
- Streaming: AsyncIterable inputs and foreach stream semantics; basic backpressure and `parallelism`
- Memory policies: `outPolicy` (`retain`/`ephemeral`), loop `releasePrevious`
- Specify test format (inputs/expected + axiom mocks)
- Document policies & hints (timeout, retry, idempotence)
 - [x] Kernel SDK: add `ctx.runChildren()` and `ctx.runSlot(name, localState, slotVars)` to allow custom components to orchestrate their slots without special‑casing in the runner. Compose runner passes meta with `children` to implementations.
 - [x] Runtime tests: cover foreach `collectPath`, `$slot.*`, `continue`/`break` (see `lcod-kernel-ts/test/flow.foreach.test.js`).
 - [x] Examples: `examples/flow/foreach_demo` and `examples/flow/foreach_ctrl_demo`

## M2 — Distribution & security
- `.lcpkg` archive format (+ integrity manifest)
- Resolution lockfile (`lcp.lock`) including contract→impl bindings
- Resolver config (project/org/user): mirrors, replace, rewrite, bindings
- Annexes: UI conventions (`[ui]`), AsyncAPI/CloudEvents (events)
