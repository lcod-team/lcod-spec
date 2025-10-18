# Contract: core/json/decode@1

Parses JSON text and returns the decoded value. This contract provides a simpler
entrypoint than `core/parse/json@1` for inline JSON data.

## Inputs (`schema/decode.in.json`)

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| `text` | string | yes | JSON source text (UTF-8). |
| `allowComments` | boolean | no | Permit JSON with comments. Defaults to `false`. |

## Outputs (`schema/decode.out.json`)

| Field | Type | Description |
| ----- | ---- | ----------- |
| `value` | any | Parsed JSON value. |
| `bytes` | number | Number of bytes consumed. |
| `error` | object | Optional structured error when parsing fails (`code = "JSON_PARSE"`). |

Use `core/parse/json@1` when you need to read from files or streams; this
contract is optimised for inline strings.
