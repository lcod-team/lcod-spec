# Contract: core/fs/write-file@1

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
