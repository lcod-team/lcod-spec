# Contract: core/parse/toml@1

Parses TOML content into a JSON-compatible object, mirroring the behavior expected for `lcp.toml` descriptors.

## Input (`schema/toml.in.json`)
- `text` (string, optional) — TOML text.
- `encoding` (string, optional) — encoding for `text` (`utf-8` by default).
- `path` (string, optional) — file path pointing to TOML content.
- `stream` (object, optional) — stream handle that yields TOML text.
- `allowInlineTableMultiline` (boolean, optional) — enable relaxed parsing for inline tables (implementation specific).

One of `text`, `path`, or `stream` must be provided.

## Output (`schema/toml.out.json`)
- `value` (object) — parsed result expressed as JSON-compatible data.
- `bytes` (number, optional) — number of bytes consumed.

Implementations should surface parsing errors with location info (line/column). When reading from `stream`, they must close it once parsing completes.
