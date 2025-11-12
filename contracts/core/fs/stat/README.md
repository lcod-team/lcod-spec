<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://contract/core/fs/stat@1.0.0

Inspect filesystem metadata for a path.

## Notes

Query filesystem metadata for a path.

## Input (`schema/stat.in.json`)
- `path` (string, required): path to inspect (absolute or relative to the current working directory).
- `followSymlinks` (boolean, optional): follow symbolic links (default true). When false, metadata is returned for the link itself.

## Output (`schema/stat.out.json`)
- `exists` (boolean): false when the path does not exist.
- `isFile`, `isDirectory`, `isSymlink` (boolean): type flags (undefined when `exists` is false).
- `path` (string, optional): normalized absolute path to the inspected entry.
- `size` (number, optional): byte size for files.
- `mtime`, `ctime` (ISO 8601 string, optional): last modification and creation/change timestamps.
