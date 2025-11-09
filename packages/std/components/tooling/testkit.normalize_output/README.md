# lcod://tooling/testkit/normalize_output@0.1.0

Normalize values produced during a test run so reports always expose a
predictable shape. The helper unwraps nested `{ result: {...} }` objects and
ensures the canonical `{ value, warnings, error }` fields are present when
available. It is primarily used by `tooling/testkit/unit@0.1.0` before storing a
slot result inside the test report.
