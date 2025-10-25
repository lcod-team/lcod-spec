# Declarative Test Format

Component packages may provide language-agnostic unit tests under `tests/unit/*.json`. Each file contains a single test case. Tooling (validators, kernels, CI) can execute the tests in any runtime by interpreting the JSON structure described below.

```json
{
  "name": "happy_path",
  "input": { "city": "Paris" },
  "expect": { "tempC": 21 },
  "mocks": {
    "lcod://axiom/http/get@1": { "status": 200, "body": "{\"tempC\":21}" }
  },
  "hints": {
    "timeoutMs": 1000
  }
}
```

## Required fields

- `name` — unique identifier for the test within the package.
- `input` — JSON object passed to the component under test (matches the component’s `inputSchema`).
- `expect` — expected output object. Kernels perform a deep equality check against the component’s response after validation.

## Optional fields

- `mocks` — object mapping canonical IDs to mocked behaviour. Two common patterns:
  - **Return fixture** (sync) — `{ "lcod://impl/...": { "return": { ... } } }`
  - **Axiom shortcut** — directly specify the shape expected by the kernel (e.g. HTTP axiom returns status/body). The exact schema is defined per axiom contract.
  Tooling should allow hooks to intercept `ctx.call(id, input)` and resolve using the supplied mocks.
- `expectError` — object matching the normalized error shape (`code`, `message`, `data`). Use this instead of `expect` when the test is meant to fail.
- `hints` — execution metadata (timeout, retries, labels). Suggested keys:
  - `timeoutMs` — maximum runtime per test.
  - `tags` — array of strings (`["smoke", "integration"]`).
- `description` — human-readable context shown in reports.

## Directory conventions

```
my_component/
  tests/
    unit/
      happy_path.json
      failure_missing_auth.json
```

Tests should ship alongside fixtures referenced by `mocks` (e.g. JSON files under `tests/fixtures/`).

For repository-wide conformance, reusable compose-based fixtures are maintained under
`lcod-spec/tests/spec`. Kernels run these via their spec harness (`npm run test:spec`,
`cargo run --bin test_specs`) to guarantee consistent behaviour across substrates.

## Cross-runtime conformance suite

The list of canonical fixtures is captured in `tests/conformance/manifest.json`. Each entry
references the underlying compose file under `tests/spec/`. The following commands consume
this manifest and compare runtimes:

- Node kernel: `npm run test:conformance` (in `lcod-kernel-js/`)
- Rust kernel: `cargo run --bin test_specs -- --manifest tests/conformance/manifest.json`
- Java kernel: upcoming Gradle task (`./gradlew conformance --manifest …`), tracked in `docs/runtime-java.md`
- Combined report: `node scripts/run-conformance.mjs` (from `lcod-spec/`)

The combined script executes both kernels with `--json` output and fails if the resulting
payloads differ, providing a concise diff when inconsistencies appear. Once the Java harness
exposes the same JSON payload, the script will compare all three runtimes automatically.

## Harness responsibilities

1. Validate `input` and `expect` against the component’s schemas.
2. Inject mocks before executing the component.
3. Compare the actual result with `expect` (or `expectError`).
4. Report structured assertions so IDEs/CI can surface failures.

## Advanced use

- For streaming outputs, `expect` may contain arrays built in the same order as the emitted items.
- Hosts may extend the format with additional keys as long as unknown fields are ignored by default.

By keeping tests declarative, LCOD packages remain portable across languages and runtimes while sharing the same behavioural guarantees.
