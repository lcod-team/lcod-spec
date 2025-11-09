# lcod://tests/spec/tooling_input_sanitizer@0.1.0

End‑to‑end spec that runs `tooling/sanitizer/probe@0.1.0` via `tooling/test_checker`
so we can confirm declared payloads survive the component input sanitiser. The
expected snapshot asserts that `expect.value.ok` is visible in the raw input,
within the declared scope, and inside the normalised value.

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `report` | object | Result forwarded from `tooling/test_checker@1`. |
