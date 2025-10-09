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
- [x] M2-06 Compose-first resolver pipeline (move recursion/caching to `lcod-resolver`, propose missing axioms for kernels)

## M3 — Runtime parity

Goal: bring Node and Rust substrates to feature parity and validate behaviour across kernels.

Delivered:
- [x] Standard infrastructure contracts (filesystem, HTTP, Git, hashing, parsing) with documentation.
- [x] Node.js axiom package `@lcod/core-node-axioms` and resolver integration.
- [x] Rust kernel bootstrap (compose runner, slots, streaming) plus scripting support and workspace-aware helpers (`docs/runtime-rust.md`).
- [x] Rust substrate parity (M3-04): resolver CLI (`cargo run --bin run_compose`) now runs the workspace helpers end-to-end using native filesystem/network bindings; `docs/runtime-rust.md` documents the package manifest loading and alias handling.
- [x] Cross-runtime conformance suite (M3-05): shared manifest `tests/conformance/manifest.json`, per-runtime runners, and the diff harness `scripts/run-conformance.mjs` comparing Node vs Rust outputs.
- [x] Shared spec fixtures with `tooling/test_checker@1` and `tooling/script@1` for compose-based testing.
- [x] Workspace/resolver isolation captured in `docs/workspaces.md`.

Next:
- [ ] M3-06 Registry scope chaining: implement stacked registries (`compose → project → platform`) in both kernels and expose project-level registration hooks.

## M4 — Observability & debugging
- [ ] M4-00 Define structured logging contract (`lcod://tooling/log@1`) for components and kernels (levels, context propagation).
- [ ] M4-01 Trace events: emit structured step/slot logs with optional scope snapshot IDs in both kernels
- [ ] M4-02 CLI trace mode (`--trace`) to stream compose execution and inspect scope mutations
- [ ] M4-03 Document trace schema & debugging guidelines (`docs/runtime-tracing.md`)
- [ ] M4-04 Prototype Debug Adapter (DAP) for compose files (breakpoints, step-in/out)

## M5 — Registry & release pipeline

Goal: prepare public releases once workspace/package layout is stable.

- [ ] M5-01 Define the registry contract (publish/list/authentication, mirror support) and document how repositories map to packages.
- [ ] M5-02 Describe the release workflow: version bump policy, compatibility matrix, and how kernels/resolver consume published artefacts.
- [ ] M5-03 Specify the assemble/ship/build pipeline (bundle format, runtime layers, per-ecosystem targets).
  - [ ] Define the `assemble` bundle structure (`lcp.lock` + `lcod_modules/` + manifest).
  - [ ] Describe optional `ship` layers (runtime inclusion, launch scripts, metadata).
  - [ ] Capture `build` targets per ecosystem (Node pkg/GraalVM, Rust binary, JVM fat JAR).
- [x] Pre-req satisfied: compose normalization helpers are in place (shared loader component).

## M6 — Backend service POC

Goal: deliver a runnable HTTP backend that exercises advanced composes and prepares deployment scenarios.

- [x] M6-01 Spec: define HTTP environment/project components (slots for sequences & routes)
- [ ] M6-02 Node backend POC: compose an HTTP endpoint backed by LCOD sequences, integrate the logging contract, and make it deployable from the CLI.
- [ ] M6-02a (stretch) Hot reload support for `env/http_host` so projects can be reloaded without downtime
- [ ] M6-03 Rust backend parity: mirror the Node backend path with the Rust kernel once M3 parity is complete.
- [x] M6-04 lc0d-resolver rewrite: express the resolver pipeline as LCOD compose (#36)
  - Shared resolver helpers (`load-descriptor`, `load-config`, `lock-path`, `build-lock`) published in `lcod-spec` and consumed by `lcod-resolver`.
- [ ] M6-05 Populate `lcod-registry` with sample functional components
- [ ] M6-06 Evaluate lightweight models for component authoring

## Future — UI & eventing

- [ ] Define UI component conventions (`[ui]` annex) once backend patterns stabilise.
- [ ] Document AsyncAPI/CloudEvents integration after the registry and backend pipelines are finalised.
