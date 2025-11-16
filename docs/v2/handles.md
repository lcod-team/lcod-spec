# Handle types (LCOD v2)

## 1. Base value model
- Plain data stays JSON-friendly (number, string, boolean, array, object, null).
- When a component needs to pass a non-serializable resource (connection, file, stream), it returns a **handle** object.

## 2. Handle structure
```json
{
  "handle": {
    "id": "opaque-uuid",
    "kind": "fs.stream",
    "capabilities": ["read", "write", "close"],
    "meta": { "path": "/tmp/log" }
  }
}
```
- `id`: opaque identifier managed by the kernel (per-session table).
- `kind`: type tag describing the resource (e.g. `fs.stream`, `db.connection`).
- `capabilities`: allowed operations; kernels must enforce them.
- `meta`: optional serializable info (URI, encoding...).

## 3. Traits / interfaces
- Components can declare `handles` in their `lcp.toml`, e.g.:
```toml
[handles.output]
kind = "fs.stream"
implements = ["trait.stream"]
```
- Traits describe the operations (`trait.stream = { read, write, close }`).
- Tooling/docs/runtimes can rely on these declarations to know which API calls are valid.

## 4. Generic invocation helper
- `lcod://tooling/handle/call@1` can expose a dynamic pathway:
```yaml
- call: lcod://tooling/handle/call@1
  in:
    handle: $.stream
    method: "write"
    args:
      - $.chunk
```
- The kernel resolves the handle by `id`, checks `capabilities`, and forwards to the native implementation.

## 5. Introspection & cleanup
- Introspection should list handles produced/consumed by a component (useful for docs and resource tracking).
- Kernels must provide lifecycle hooks (`finalize`/`close`) to avoid leaks when a compose ends or is cancelled.

## 6. Next steps
1. Define canonical trait definitions (stream, db connection, http client, ...).
2. Extend `lcp.toml` schema with a `handles` section.
3. Implement `handle/call@1` helper and runtime tables for per-kernel resource management.
