# Contract: core/json/encode@1

Serializes structured data into JSON text with deterministic output. Implementations
must guarantee UTF-8 output and optionally support pretty-printing and key sorting.

## Inputs (`schema/encode.in.json`)

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| `value` | any | yes | Data to encode. |
| `space` | integer | no | Indentation width (0-10). Defaults to `0` (compact). |
| `sortKeys` | boolean | no | When `true`, object keys are sorted alphabetically. |
| `asciiOnly` | boolean | no | When `true`, escape non-ASCII characters. |

## Outputs (`schema/encode.out.json`)

| Field | Type | Description |
| ----- | ---- | ----------- |
| `text` | string | JSON representation. |
| `bytes` | integer | Number of UTF-8 bytes emitted. |

Errors should be returned in the output envelope (for example `error.code = "UNSERIALISABLE"`)
when values cannot be serialized (circular references, BigInt, etc.).
