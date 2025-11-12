<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://contract/core/string/split@1.0.0

Split a string by a literal separator.

## Notes

Split a string using a literal separator.

## Input (`schema/split.in.json`)
- `text` (string, required): source text.
- `separator` (string, required): literal delimiter.
- `limit` (integer, optional): maximum number of segments.
- `trim` (boolean, optional): trim whitespace around segments (default false).
- `removeEmpty` (boolean, optional): drop empty results (default false).

## Output (`schema/split.out.json`)
- `segments` (array): ordered list of resulting substrings.
