<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://contract/tooling/jsonl/read@1.0.0

Read a JSON Lines source and return the parsed entries.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `path` | string | No | Path to the JSONL file on disk. |
| `url` | string | No | URL to a JSONL resource (reserved for future use). |
| `encoding` | string | No | Optional text encoding (defaults to utf-8). |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `entries` | array | Parsed JSON values (one per non-empty line). |
| `warnings` | array<string> | Optional warnings emitted while reading the file. |
