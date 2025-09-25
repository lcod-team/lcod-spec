# Contract: core/fs/read-file@1

Reads a file from the local filesystem.

## Input (`schema/read_file.in.json`)
- `path` (string) — absolute or project-relative path
- `encoding` (string, optional) — `utf-8`, `base64`, or `hex` (default `utf-8`)

## Output (`schema/read_file.out.json`)
- `data` — string encoded with the requested encoding (defaults to UTF-8)
- `encoding` (string) — encoding applied to `data`
- `size` (number) — number of bytes
- `mtime` (string, optional) — last modified timestamp

Implementations should surface errors with meaningful codes (e.g. `ENOENT`).
