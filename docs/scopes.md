# Scopes and References

- `$` — run state (aliases produced via `out`)
- `$slot.*` — variables injected by the parent block (foreach: `item`, `index`; try: `error`)
- `$env` — process/environment variables (read-only)
- `$globals` — global symbols service (admin-managed, mutable via contracts)
- `$run` — run metadata (traceId, timestamps)
- `$this` — current step input/output (for internal use; rarely needed in DSL)

Resolution order: local `let` → `$` → `$slot` → `$globals` → `$env`.

