# Java Substrate Blueprint

This note tracks the state of the Java reference substrate (`lcod-kernel-java`) and how it lines up with the Node.js and Rust runtimes. It complements the existing quickstart and conformance docs and anchors Milestone **M3-07/M3-08 — Java runtime parity** in the roadmap.

## Requirements

- **JDK 21** — enforced through the Gradle toolchain. Set `JAVA_HOME` or `ORG_GRADLE_JAVA_INSTALLATIONS_PATHS` if your default JDK differs.
- **Gradle Wrapper** — the repository ships `./gradlew`, so no global Gradle installation is needed.
- **Spec checkout** — place `lcod-spec`, `lcod-kernel-js`, `lcod-kernel-rs`, and `lcod-kernel-java` side by side to reuse the shared fixtures.

```text
~/git/lcod-spec
~/git/lcod-kernel-js
~/git/lcod-kernel-rs
~/git/lcod-kernel-java
```

## Layout

```
lcod-kernel-java/
├── build.gradle.kts      # Kotlin build script (Shadow Jar + toolchain)
├── gradle.properties     # Version + repo coordinates for publishing
├── src/
│   ├── main/java/work/lcod/kernel/
│   │   ├── api/          # Public embedding API (LcodRunner, RunResult…)
│   │   ├── cli/          # Picocli entrypoint exposed via `java -jar`
│   │   ├── core/         # Contract/axiom placeholders
│   │   ├── flow/         # Flow orchestration helpers (signals, errors)
│   │   ├── runtime/      # Compose loader, registry, execution context
│   │   └── shared/       # Utilities (duration parsing, etc.)
│   └── test/java/work/lcod/kernel/  # Harness for upcoming fixtures
└── README.md / ROADMAP.md
```

The `api` package exposes a small builder so host applications can embed the runner without going through the CLI. The CLI layer (`cli.Main`) forwards `lcod-run` flags to the shared runtime builder, matching the Rust binary’s UX.

## Building and running

```bash
# Clean + produce the shaded CLI artefact
./gradlew clean shadowJar

# Execute a compose through the CLI
java -jar build/libs/lcod-run-0.1.0-SNAPSHOT.jar \
  --compose examples/flow/foreach_demo/compose.yaml \
  --state tests/payload.json
```

Embedding follows the same pattern as other runtimes:

```java
var configuration = LcodRunConfiguration.builder()
    .composeTarget(ComposeTarget.forLocal(Path.of("./compose.yaml")))
    .workingDirectory(Path.of("."))
    .lockFile(Path.of("./lcp.lock"))
    .cacheDirectory(Path.of("./.lcod/cache"))
    .logLevel(LogLevel.INFO)
    .build();

RunResult result = new LcodRunner().run(configuration);
```

`RunResult` mirrors the Node/Rust payloads (status, timings, metadata) so downstream hosts can serialise it to JSON without bespoke adapters.

## Coverage snapshot (October 2025)

| Area | Status | Notes |
|------|--------|-------|
| Compose loader / registry | ✅ scaffolded | `runtime.ComposeLoader` parses YAML, registers blocks, and resolves slot wiring. |
| Flow orchestration | ⚠️ partial | Signals (`break`, `continue`, `error`) exist; foreach/parallel implementations still mirror the Node logic progressively. |
| Core contracts / axioms | 🚧 stub | Contract bridges live under `core.CorePrimitives`; they currently expose demo implementations while the real bindings land. |
| CLI & embedding | ✅ ready | Picocli entrypoint and public API are wired and already enforce Gradle/Java 21 requirements. |
| Spec fixtures | 🚧 pending | `tests/spec` assets are not imported yet; see KJ-10/KJ-13 in the kernel roadmap. |

## Working with the spec fixtures

Until the dedicated Gradle task ships, reuse the shared manifest manually:

```bash
SPEC_REPO_PATH=../lcod-spec \
  ./gradlew run --args "--compose ../lcod-spec/tests/spec/flow.foreach/compose.yaml --json"
```

Upcoming work (tracked in `lcod-kernel-java/ROADMAP.md`) will introduce:

- `./gradlew conformance --manifest ../lcod-spec/tests/conformance/manifest.json`
- JSON output compatible with `node scripts/run-conformance.mjs`
- CI jobs that run side by side with the Node (`npm run test:spec`) and Rust (`cargo run --bin test_specs`) harnesses

## Alignment goals

1. **Slot parity** — implement `ctx.runChildren()` / `ctx.runSlot()` equivalents so flow contracts behave identically across runtimes.
2. **Workspace awareness** — honour `workspace.lcp.toml` + `componentsDir` like the Rust/Node kernels (`docs/workspaces.md`).
3. **Resolver compatibility** — accept resolver-generated lockfiles, cache layout, and env overrides without diverging options.
4. **Conformance automation** — feed Java results back into `scripts/run-conformance.mjs` once the Gradle task exposes a `--json` mode; this keeps diffing logic centralised.

With these pieces in place we reach the same “green bar” policy enforced for the other kernels: every change in `lcod-kernel-java` must pass the shared fixtures and stay in sync with the JS/Rust reference outputs.
