# lcod://tooling/sanitizer/probe@0.1.0

Observes what the kernel passes into a component after sanitisation so we can
assert that declared payloads remain reachable. The probe inspects the special
`__lcod_input__` field as well as the fully sanitised scope and returns a simple
report describing what it found.

## Inputs

| Name | Type | Description |
| --- | --- | --- |
| `expect` | object | Structure declared by the caller that should round‑trip through the sanitiser. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `result` | object | Report containing `rawInput`, `declaredExpect`, and `valueExpect` mirrors from the current scope. |

Use this component from spec checks (or local debugging flows) to ensure the
input sanitiser does not drop declared fields.
