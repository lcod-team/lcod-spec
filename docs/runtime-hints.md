# Runtime Policies and Hints

Component descriptors may declare execution hints under the `[hints]` table in `lcp.toml`. Hosts interpret these values to tune retries, timeouts, and purity guarantees while keeping behaviour configurable per environment.

Example:

```toml
[hints]
timeoutMs = 5000
retries = 1
idempotent = true
pure = false
```

## Supported hints

| Key         | Type     | Meaning |
|-------------|----------|---------|
| `timeoutMs` | integer ≥ 0 | Soft deadline (milliseconds) for a single invocation. Hosts cancel or abort calls that exceed the budget. |
| `retries`   | integer ≥ 0 | Maximum number of automatic retries after transient failures. Applies only to idempotent operations. |
| `idempotent`| boolean | Indicates that repeating the call with the same input produces the same outcome (no side-effects). Enables safe retries/backoff. |
| `pure`      | boolean | Stronger than idempotent: the call has no side effects and depends solely on its inputs. Hosts may memoize or reuse results. |

Future iterations may introduce additional hints (e.g. concurrency limits, circuit-breaker policies). Unknown keys should be ignored by hosts.

## Host responsibilities

- **Validation** — treat hints as advisory defaults. Operators may override them via configuration or policy.
- **Timeout handling** — ensure resources are reclaimed when a timeout expires (abort fetch, cancel promises, etc.).
- **Retry strategy** — apply exponential backoff or jitter when `retries > 0`. Only retry when the previous attempt raised a retriable error.
- **Tracking** — surface hint overrides and actual behaviour in logs/metrics to aid debugging.

## Compose overrides

Flow blocks can expose additional knobs (e.g. `parallelism`). When necessary, composite authors may wrap an implementation with a different hint profile by publishing a façade component with its own `[hints]` section.

## Best practices for authors

- Set `timeoutMs` to a realistic upper bound of the implementation. Shorter is better; hosts can still extend it when needed.
- Mark `idempotent = true` whenever external mutations are absent. This allows safe retries during network failures.
- Use `pure = true` only when the implementation is deterministic and side-effect free (useful for caching).
- Document any non-default semantics (e.g. `retries` implies exponential backoff) in the component’s README.

These hints complement the structural guarantees documented in `schema/lcp.schema.json` and work alongside memory/streaming guidance.
