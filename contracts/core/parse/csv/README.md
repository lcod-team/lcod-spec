# Contract: core/parse/csv@1

Parses CSV content and returns rows as JSON objects, with streaming support for large datasets.

## Input (`schema/csv.in.json`)
- `text` (string, optional) — CSV content.
- `encoding` (string, optional) — encoding for `text` (`utf-8` default).
- `path` (string, optional) — file path to CSV data.
- `stream` (object, optional) — stream handle yielding CSV bytes.
- `delimiter` (string, optional) — defaults to `","`.
- `quote` (string, optional) — defaults to `"""`.
- `header` (boolean or array, optional) — `true` to use first row as header, array of column names to override, `false` for numeric keys.
- `trim` (boolean, optional) — trim whitespace around fields.
- `maxRows` (number, optional) — stop after emitting this many rows.

## Output (`schema/csv.out.json`)
- `rows` (array, optional) — JSON array of rows when the dataset is small and streaming is disabled.
- `stream` (object, optional) — stream handle producing JSON-encoded rows when streaming is requested or data exceeds host thresholds.
- `columns` (array, optional) — list of column names used.
- `bytes` (number, optional) — number of bytes processed.

When `stream` is returned, each call to `core/stream/read@1` yields a chunk encoded as JSON representing a row (object or array). Consumers can use `foreach` with `stream` to process rows incrementally.
