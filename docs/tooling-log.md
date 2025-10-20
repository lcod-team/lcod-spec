# Logging Contract (`lcod://contract/tooling/log@1`)

`tooling/log@1` defines a minimal, structured logging interface shared across runtimes. Kernels call this contract for their own diagnostics, and compositions can bind it to environment-specific sinks (stdout, files, SaaS loggers, analytics pipelines…).

## Payload structure

```json
{
  "level": "info",
  "message": "cache miss",
  "data": { "key": "user/42", "latencyMs": 12.5 },
  "error": { "message": "boom", "stack": "Error: boom\n    at …" },
  "tags": { "component": "kernel", "env": "dev" },
  "timestamp": "2025-10-09T21:30:00.000Z"
}
```

| Field      | Type    | Required | Notes |
| ---------- | ------- | -------- | ----- |
| `level`    | string  | yes      | One of `trace`, `debug`, `info`, `warn`, `error`, `fatal`. |
| `message`  | string  | yes      | Human-readable message. Empty strings are rejected. |
| `data`     | object  | no       | Structured payload (request ids, metrics, …). |
| `error`    | object  | no       | Optional error description. May include `message`, `stack`, `type`, and implementation-specific fields. |
| `tags`     | object  | no       | Flat metadata (values must be string/number/boolean). Useful for routing (`component`, `env`, `requestId`). |
| `timestamp`| string  | no       | ISO‑8601 timestamp. If omitted, the implementation assigns one. |

Unknown fields are rejected to keep payloads predictable.

## Kernel expectations

- Kernels SHOULD expose an internal helper (e.g. `lcod://kernel/log@1`) that enriches log calls with `tags.component = "kernel"` and delegates to the contract when bound.
- Before an implementation is bound, kernels MUST provide a fallback (stdout/stderr JSON) so logs are not lost.
- When `tooling/registry/scope@1` opens a scope, kernels MAY push additional tags (e.g. `scopeId`, `scopeName`, `project=foo`) by augmenting context for child logs. Leaving a scope restores the previous tag set.
- Implementations MUST NOT throw when processing logs. Failures should be reported via stderr or a metrics channel without crashing the caller.
- The logger name `kernel` (and any helper under `lcod://kernel/log@*`) is reserved for runtime diagnostics; component packages MUST NOT rebind or override it.
- Both kernels honour the environment variable `LCOD_LOG_LEVEL` (default `fatal`). Logs whose level ranks below the threshold are skipped unless a custom contract binding is installed. Setting `LCOD_LOG_LEVEL=info`, for example, re-enables the runtime instrumentation used for compose tracing.
- The threshold is refreshed on every log emission: changing `LCOD_LOG_LEVEL` (or invoking `lcod-run --log-level …`) takes effect immediately without restarting the process or rebinding the logger. Only kernel diagnostics (`tags.component = "kernel"`) are muted by default; user logs continue to flow even without a custom binding.

## Logger metadata (`lcp.toml`)

Every package that emits logs SHOULD declare them under `lcp.toml[logging]`. The section lists logger identifiers, default levels, and human-readable descriptions so hosts can present a consistent configuration UI/CLI. Future lint tooling will resolve composes, enumerate logger usage (including helpers such as `tooling/log.context@1`), and verify that each logger appears in `lcp.toml[logging]`.

## Context propagation

Runtimes maintain a per-scope log context (similar to MDC). A helper like `lcod://tooling/log.context@1` can push tags for the current scope:

```yaml
compose:
  - call: tooling/log.context@1
    in: { tags: { requestId: $.request.id } }
    children:
      - call: lcod://contract/tooling/log@1
        in:
          level: info
          message: "processing request"
```

On exit, tags are restored. Nested scopes merge tags (`child` tags override on key collision). This matches the `Mapped Diagnostic Context` concept without relying on thread-local storage.

## Schema

The machine-readable schema lives at `schemas/tooling/log.schema.json` and mirrors the table above.

## Roadmap alignment

`ROADMAP.md` milestone M4-00 references this contract as the precursor to kernel instrumentation and trace tooling.
