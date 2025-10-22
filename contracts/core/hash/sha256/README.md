<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://contract/core/hash/sha256@1.0.0

Compute the SHA-256 digest of data provided inline or via stream/file handle.

## Notes

Computes the SHA-256 digest of data provided inline, as a file path, or via a stream handle.

## Input (`schema/sha256.in.json`)
- `data` (string, optional) — payload to hash.
- `encoding` (string, optional) — encoding for `data` (`utf-8`, `base64`, `hex`, defaults to `utf-8`).
- `path` (string, optional) — absolute path to a file to hash.
- `stream` (object, optional) — stream handle compatible with `core/stream/read@1`.
- `chunkSize` (number, optional) — chunk size in bytes when reading from path or stream.

Exactly one of `data`, `path`, or `stream` should be provided.

## Output (`schema/sha256.out.json`)
- `hex` (string) — lowercase hexadecimal digest.
- `base64` (string) — base64 digest.
- `bytes` (number, optional) — number of bytes processed.

Implementations should stream large inputs to avoid memory bloat and must close any stream handle when `stream` is supplied (unless the caller is expected to manage it explicitly).
