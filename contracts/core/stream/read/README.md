# Contract: core/stream/read@1

Reads the next chunk from a stream handle produced by another contract (HTTP response, filesystem reader, LLM event feed).

## Input (`schema/read.in.json`)
- `stream` (object) — stream handle (`id` required, plus optional `encoding`, `mediaType`, `storage`, `metadata`).
- `maxBytes` (number, optional) — limit the size of the chunk returned.
- `timeoutMs` (number, optional) — wait duration before giving up when no data is available.
- `decode` (string, optional) — request decoding (`utf-8`, `base64`, `json`, `binary`). Defaults to the handle’s `encoding` or `binary`.

## Output (`schema/read.out.json`)
- `done` (boolean) — `true` when the stream is exhausted.
- `chunk` (string, optional) — payload chunk when `done = false`.
- `encoding` (string, optional) — encoding used for `chunk`.
- `bytes` (number, optional) — number of bytes represented by the chunk.
- `seq` (number, optional) — monotonic sequence number starting at 0.
- `stream` (object) — the (possibly updated) stream handle to reuse for the next `read`.

When `done = true`, implementations omit `chunk` and may clear temporary storage (unless the caller requests otherwise by handling the stream differently). Consumers should call `core/stream/close@1` once they are done.
