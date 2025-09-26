# Roadmap — lcod-spec

## M0 — Core format

Goal: Ship the minimal spec to describe, validate and distribute a single component package.

Tickets:
- [x] M0-01 Finalize `schema/lcp.schema.json` with `$defs`, descriptions, examples
- [x] M0-02 Add `kind="contract"` and optional `implements` to schema; document contracts vs implementations
- [x] M0-03 Document ID and versioning (`docs/id-and-versioning.md`) and link from README — partial
- [x] M0-04 Namespace policy (`docs/namespaces.md`) — include reserved roots: `contract/`, `impl/`, `axiom/`, `flow/` — partial
- [x] M0-05 Folder conventions (`docs/structure.md`)
- [x] M0-06 Schema best practices (`docs/schemas.md`)
- [x] M0-07 Minimal validator (`scripts/validate.cjs`, `make validate`)
- [x] M0-08 Strict validator with Ajv + TOML (CI uses dev deps) — partial (falls back locally)
- [x] M0-09 CI workflow `.github/workflows/validate.yml`
- [x] M0-10 Minimal UI example (`examples/ui/hello_button`)
- [x] M0-11 Guide “Create a new component” (`docs/create-component.md`)

## M1 — Composition & tests
- [x] Specify `compose.yaml` with slots (`children` default, named multi‑slots), scopes (`$`, `$slot`, `$env`, `$globals`, `$run`)
- [x] Flow blocks: `flow/if@1`, `flow/foreach@1` (array/stream + `collectPath` and `else`), `flow/parallel@1`
- [x] Errors: `flow/try@1` (children/catch/finally), `flow/throw@1`; error structure (code/message/data)
- [x] Streaming: AsyncIterable inputs and foreach stream semantics; basic backpressure and `parallelism`
- [x] Memory policies: `outPolicy` (`retain`/`ephemeral`), loop `releasePrevious`
- [x] Specify test format (inputs/expected + axiom mocks)
- [x] Document policies & hints (timeout, retry, idempotence)
 - [x] Kernel SDK: add `ctx.runChildren()` and `ctx.runSlot(name, localState, slotVars)` to allow custom components to orchestrate their slots without special‑casing in the runner. Compose runner passes meta with `children` to implementations.
 - [x] Runtime tests: cover foreach `collectPath`, `$slot.*`, `continue`/`break`, `else`, and async streams (see `lcod-kernel-js/test/flow.foreach.test.js`).
 - [x] Examples: `examples/flow/foreach_demo` and `examples/flow/foreach_ctrl_demo`

## M2 — Distribution & security
- [x] M2-01 Define `lcp.lock` schema + strict validation (tooling, docs)
- [x] M2-02 Publish resolver as composite package (uses axioms for filesystem/git/http)
- [x] M2-03 Resolver CLI + config (mirrors, replace, bindings)
- [x] M2-04 `.lcpkg` archive format (+ integrity manifest)
- [x] M2-05 End-to-end example: resolve → lockfile → package
- Annexes: UI conventions (`[ui]`), AsyncAPI/CloudEvents (events)

## M3 — Runtime substrates
- [x] M3-01 Define standard infrastructure contracts (filesystem, HTTP, Git, hashing, TOML/JSON parsing)
  - [x] Draft `contract/core/fs/read-file@1` (schema + README)
  - [x] Draft `contract/core/fs/write-file@1` (schema + README)
  - [x] Draft `contract/core/fs/list-dir@1` (schema + README)
  - [x] Draft `contract/core/http/request@1` (schema + README)
  - [x] Draft `contract/core/stream/read@1` & `core/stream/close@1` (schema + README)
  - [x] Draft `contract/core/git/clone@1` (schema + README)
  - [x] Draft `contract/core/hash/sha256@1` (schema + README)
  - [x] Draft `contract/core/parse/{json,toml,csv}@1` (schema + README)
- [ ] M3-02 Provide Node.js axiom implementations for these contracts (publishable package)
- [ ] M3-03 Integrate resolver composite with Node axioms and validate end-to-end
- [ ] M3-04 Implement a Rust substrate for the same contract set to validate portability
  - [x] Bootstrap `lcod-kernel-rs` compose runner, slot orchestration and streaming handles (mirrors spec foreach demos)
  - [ ] Implement core contract bindings (filesystem, HTTP, Git, hash, parse) in Rust with parity tests vs Node
  - [ ] Publish conformance artefacts (fixtures + diff tooling) for Node/Rust comparison
- [ ] M3-05 Cross-runtime conformance tests & documentation on axiom providers
  - [x] Define `tooling/test_checker@1` contract and shared spec fixtures for compose-based tests (foreach demos, script_range)
- [ ] M3-06 Embedded scripting sandbox API (`$api.run`, `$api.config`) for lightweight algorithms
  - [x] Publish `tooling/script@1` contract (docs + schemas) and seed fixtures under `examples/tests`
