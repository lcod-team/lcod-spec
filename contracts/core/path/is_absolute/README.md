<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://contract/core/path/is_absolute@1.0.0

Report whether a path string is absolute (POSIX/Windows).

## Notes

Return `true` when the provided path string is absolute. This mirrors
Node's `path.isAbsolute` semantics (POSIX `/foo`, Windows `C:oo`, `\host`).

## Input (`schema/is_absolute.in.json`)
- `path` (string, optional): value to check (defaults to "").

## Output (`schema/is_absolute.out.json`)
- `absolute` (boolean): true if absolute, false otherwise.
