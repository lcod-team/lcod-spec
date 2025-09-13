# Memory and Retention

- Default: only values mapped via `out` are retained in the run state `$`.
- `outPolicy`: `retain` (default), `ephemeral` (compute-and-discard), `keepAll` (debug only).
- Loops: hint `releasePrevious: true` to drop per-iteration temporaries.
- Checkpoints: a `flow/checkpoint@1` block may persist a snapshot for debug/recovery.

