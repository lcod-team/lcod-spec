<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://contract/core/path/dirname@1.0.0

Return the parent directory of a path.

## Notes

Compute the parent directory of a POSIX/Windows-like path.

Trailing separators (except for the root itself) are ignored. When the path
has no parent directory, the contract returns ".".

## Input (`schema/dirname.in.json`)
- `path` (string, optional): path to evaluate (defaults to the empty string).

## Output (`schema/dirname.out.json`)
- `dirname` (string): parent directory or "." when none exists.
