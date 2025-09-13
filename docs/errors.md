# Errors: try/catch/finally and throw

- Flow `lcod://flow/try@1` with slots: `children` (try), `catch`, `finally`.
- Flow `lcod://flow/throw@1` to raise structured errors: `{ code?, message, data? }`.
- Normalization: all thrown errors are normalized to `{ code, message, data? }`.
- In `catch`, `$slot.error` exposes the error object.

