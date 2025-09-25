# Contract: core/parse/json@1

Parses JSON content from a string, file, or stream into canonical JavaScript values.

## Input (`schema/json.in.json`)
- `text` (string, optional) — JSON text to parse.
- `encoding` (string, optional) — encoding for `text` (`utf-8` by default).
- `path` (string, optional) — file path containing JSON.
- `stream` (object, optional) — stream handle to consume incrementally.
- `schemaPath` (string, optional) — relative path to a JSON Schema to validate the result against.
- `allowComments` (boolean, optional) — allow JSON with comments (implementation-specific fallback).

Exactly one of `text`, `path`, or `stream` should be provided.

## Output (`schema/json.out.json`)
- `value` (object/array/primitive) — parsed JSON value.
- `bytes` (number, optional) — number of bytes consumed.
- `validated` (boolean, optional) — `true` when schema validation succeeded.

Implementations should stream parse when reading from file/stream and report syntax or validation errors with informative messages.
