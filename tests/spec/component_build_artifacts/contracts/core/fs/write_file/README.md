<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://contract/core/fs/write-file@1.0.0

Write data to the local filesystem with optional encoding and metadata controls.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `path` | string | Yes | Absolute or project-relative file path. |
| `data` | string | Yes | Payload to write. Interpreted according to encoding. |
| `encoding` | enum(utf-8, base64, hex) | No | Encoding applied to data. Defaults to utf-8. |
| `append` | boolean | No | Append to an existing file instead of replacing it. |
| `createParents` | boolean | No | Create missing parent directories when true. |
| `mode` | string | No | Optional POSIX file mode (octal string). |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `bytesWritten` | integer | Number of bytes written to disk. |
| `mtime` | string | Last modification timestamp after writing. |

## Notes

Writes data to the local filesystem, optionally creating parent directories.

## Input (`schema/write_file.in.json`)
- `path` (string) — absolute or project-relative file path.
- `data` (string) — payload to write.
- `encoding` (string, optional) — `utf-8`, `base64`, or `hex` (defaults to `utf-8`).
- `append` (boolean, optional) — when `true`, append to an existing file instead of replacing it.
- `createParents` (boolean, optional) — create missing parent directories (defaults to `false`).
- `mode` (string, optional) — POSIX-style file mode (e.g. `0644`).

## Output (`schema/write_file.out.json`)
- `bytesWritten` (number) — number of bytes written to disk.
- `mtime` (string, optional) — last modified timestamp in ISO 8601 format.

Implementations should surface filesystem errors with clear codes (e.g. `EACCES`, `ENOENT`).
