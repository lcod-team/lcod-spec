# Contract: core/stream/close@1

Closes a stream handle returned by `core/stream/read@1` producers (HTTP downloads, file readers, etc.). It guarantees resources are released even if consumers exit early.

## Input (`schema/close.in.json`)
- `stream` (object) — stream handle (`id` required, optional `storage`, `metadata`).
- `deleteFile` (boolean, optional) — when `true` and the handle references a temporary file, the runtime removes it after closing.

## Output (`schema/close.out.json`)
- `released` (boolean) — `true` when the handle was closed.
- `removed` (boolean, optional) — `true` when a temporary file was deleted.

Closing an already-released handle should return `released = false` with an informative error or `removed = false`. Hosts may reclaim resources automatically when the process ends, but calling this contract remains the recommended practice in compose flows.
