# Memory and Retention Policies

Compose flows accumulate state in the `$` scope. By default only the values exposed through `out` remain accessible to downstream steps. This document describes additional hints that let authors control retention and lifecycle of intermediate data.

## `outPolicy`

Applied on individual steps within `compose.yaml` (usually via the flow block implementation). Supported values:

| Value        | Semantics |
|--------------|-----------|
| `retain`     | (default) Keep outputs in `$` after the step finishes. |
| `ephemeral`  | Outputs are available only within the current step/iteration. After the step completes, the kernel releases the stored value. Exposed aliases may still exist inside child scopes.|
| `keepAll`    | Debug/trace mode. Persist every intermediate value for observability, even if not referenced later. Hosts may downsample to avoid memory pressure.|

Composite authors typically apply `ephemeral` to heavy intermediate results (e.g. large HTTP payloads) that are consumed immediately.

## Loop hints: `releasePrevious`

Flow blocks that iterate (e.g. `flow/foreach@1`) may accept a boolean hint `releasePrevious`.

- `false` (default) — the previous iteration’s state remains available until overwritten. Useful when later iterations reference earlier results.
- `true` — after each iteration completes, the kernel clears buffers from the prior iteration before starting the next. Combine with `collectPath` or explicit aggregation to persist only the data you need.

## Checkpoints (future)

A planned `flow/checkpoint@1` block will capture snapshots of the run state for debugging or resumable executions. Until then, hosts may expose custom logging or tracing adapters.

## Best practices

- Prefer `ephemeral` for transient artifacts (e.g. decoded payloads used only to derive a smaller object).
- When consuming streams, pair `ephemeral` with `releasePrevious = true` to prevent unbounded growth.
- Avoid `keepAll` in production; reserve it for debugging builds or traceable environments.
- Remember that values exposed via `out` ultimately depend on the implementation: composite blocks should explicitly choose what to expose instead of relying on defaults.

See also `docs/streams.md` for guidance on streaming workloads and `docs/compose-dsl.md` for state-scoping rules.
