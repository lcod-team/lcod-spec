<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://contract/tooling/test_checker@1.0.0

Execute a compose with an input and validate the output against an expected value.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `input` | object | No | State injected before running the compose. |
| `compose` | array<object> | No | Inline compose definition to execute. |
| `composeRef` | object | No | Reference to an on-disk compose when `compose` is omitted. |
| `expected` | any | Yes | Expected output payload. |
| `bindings` | array<object> | No | Optional bindings overrides applied before execution. |
| `streams` | array<object> | No | Synthetic streams registered before running the compose. |
| `failFast` | boolean | No | When false, collect all diffs instead of stopping at the first mismatch. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `success` | boolean | Whether the actual output matched the expectation. |
| `actual` | any | Actual output returned by the compose. |
| `expected` | any | Mirror of the expected payload for convenience. |
| `durationMs` | number | Execution time in milliseconds. |
| `messages` | array<string> | Diagnostic messages collected during execution. |
| `diffs` | array<object> | Optional diff information when the assertion fails. |

## Notes

A generic harness contract that executes a target compose and validates its
output against an expected payload. Runtime implementations are responsible for
loading the compose, running it with the supplied input, and returning a
structured report.

## Responsibilities of the host runtime

- Resolve the compose definition either from the inline `compose` field or by
  loading the file pointed to by `composeRef.path`.
- Execute the compose with the provided `input` value. The compose is evaluated
  in the same environment as any other user flow: bindings, slots, and contracts
  should behave identically.
- Compare the compose result with the `expected` value. Implementations may
  perform deep equality or provide richer diffing, but the final `success` flag
  must reflect the comparison outcome.
- Populate the response with the actual output and any optional diagnostic data
  (`diff`, `messages`, etc.).

## Suggested behaviour

- `bindings`, `axioms` and `overrides` fields allow the caller to tweak the
  registry or provide mock implementations before executing the compose.
- `streams` lets callers describe synthetic stream handles (chunks + encoding)
  that the runtime should register and inject at specific paths in the initial
  state before execution.
- When `failFast` is `false`, implementations may collect multiple assertion
  failures and return them in the `messages` array.
- Runtimes are encouraged to attach metadata such as execution time or kernel
  version to ease cross-runtime comparisons.

The contract is intentionally minimal so that different kernels (Node, Rust,
...) can consume the same spec fixtures and report consistent results.
