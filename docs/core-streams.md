# Core Stream Contracts

LCOD streams model long-running or large data transfers (HTTP downloads, file reads, LLM event feeds) without forcing callers to buffer everything as base64. Producers expose a **stream handle** that consumers can poll or hand to helper contracts.

> **Note:** Examples in this document may still reference the legacy `children`
> key for slot execution. The canonical key is `slots`; kernels continue to
> support `children` during the migration.

## Stream handle shape

A stream handle is a JSON object with the following fields:

```json
{
  "id": "uuid-or-path",
  "encoding": "base64",
  "mediaType": "application/octet-stream",
  "storage": {
    "kind": "file",
    "path": "/abs/path/to/temp.bin",
    "size": 24576
  },
  "metadata": {
    "expiresAt": "2025-10-01T12:00:00Z",
    "origin": "http"
  }
}
```

Required fields:
- `id` — unique identifier in the host runtime.

Optional fields:
- `encoding` — default chunk encoding returned by `stream/read` (`utf-8`, `base64`, `json`, `binary`).
- `mediaType` — MIME type when known.
- `storage` — hints about how data is buffered (`kind = file|memory|external`, `path`, `size`).
- `metadata` — implementation-defined extra fields (timestamps, source URI).

Hosts keep the handle alive until `stream/close` executes or the process ends.

## Contract set

| Contract | Purpose |
|----------|---------|
| `lcod://contract/core/stream/read@1` | Pull the next chunk from a stream handle. |
| `lcod://contract/core/stream/close@1` | Release resources associated with a stream handle. |

Future work may add `stream/info`, `stream/seek`, or push-based adapters, but the above pair is enough for HTTP/file download scenarios.

## `core/stream/read@1`

- Inputs: `stream` handle, optional `maxBytes`, `timeoutMs`, `decode`.
- Output: `chunk` (string), `encoding`, `bytes`, `seq`, `done` flag. When `done = true`, `chunk` is omitted.

`decode = "utf-8"` asks the runtime to convert the chunk into UTF‑8 text regardless of the underlying encoding. `decode = "binary"` (default) keeps the original encoding.

## `core/stream/close@1`

- Inputs: `stream` handle, optional `deleteFile` flag (defaults to false).
- Output: acknowledgment with `released = true` when the handle was closed.

When `deleteFile = true` and `storage.kind = "file"`, the runtime removes the temporary file after closing.

## Using streams in compose

Producers (HTTP, filesystem, LLM adapters) that return a stream expose a field named `stream` with the handle described above. Consumers pass the handle to `core/stream/read@1` inside a loop:

```yaml
compose:
  - call: lcod://core/http/request@1
    in:
      url: https://example/file.csv
      responseMode: stream
    out:
      stream: download
  - call: lcod://flow/foreach@1
    in:
      stream: $.download.stream
    children:
      body:
        - call: lcod://core/stream/read@1
          in:
            stream: $.download.stream
            decode: utf-8
          out:
            chunk: current
        - call: lcod://flow/if@1
          in:
            cond: $.current.done
          children:
            then:
              - call: lcod://core/stream/close@1
                in:
                  stream: $.download.stream
            else:
              - call: lcod://impl/csv/process-chunk@1
                in:
                  chunk: $.current.chunk
```

Hosts are encouraged to offer syntactic sugar (e.g. exposing a stream handle directly to `foreach`) but the canonical contracts remain the ones above.

## Lifecycle considerations

- Always close a stream when the consumer is done, preferably via `try/finally`.
- Hosts may enforce TTLs; `stream/read@1` should fail with a descriptive error if the handle expired.
- Stream handles are per-host resources; they are not serializable across machines without custom adapters.

## Relationship with existing docs

- `docs/streams.md` describes logical flow semantics and hints (`parallelism`, `prefetch`).
- `docs/core-contracts.md` lists the canonical stream contracts alongside filesystem and HTTP primitives.
- `docs/runtime-hints.md` should be consulted for timeout/retry behavior when combining streams with long-running operations.
