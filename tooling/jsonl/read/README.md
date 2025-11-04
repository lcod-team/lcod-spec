<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://tooling/jsonl/read@0.1.0

Read a JSON Lines file and return the parsed entries.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `path` | string | No | Path to the JSONL file on disk. |
| `url` | string | No | URL to a JSONL resource (not yet implemented). |
| `encoding` | string | No | Optional text encoding (defaults to utf-8). |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `entries` | array | Parsed JSON values (one per non-empty line). |
| `warnings` | array<string> | Optional warnings emitted while reading the file. |
