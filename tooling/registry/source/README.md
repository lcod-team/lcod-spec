# Registry Source Loader (`tooling/registry/source/load@0.1.0`)

Normalizes registry source declarations from the resolver configuration. It reads
packages.jsonl (and optionally registry.json) when the source points at a local
path, supports inline JSONL snippets, and aggregates the data into a structure
ready to feed `tooling/registry/index@0.1.0`.

## Behaviour

- Supports `type: path` (default), `type: jsonl`, and `type: inline`.
- For path sources, expects a root `path`, optional `packagesPath` (default
  `packages.jsonl`) and `registryPath` (default `registry.json`).
- Computes absolute paths relative to the provided `projectPath`.
- Inline JSONL content is also supported via the `jsonl` field.
- Returns the collected JSON Lines plus resolved defaults for each registry.

## Inputs

```json
{
  "projectPath": "/abs/project",
  "sources": [
    { "id": "official", "type": "path", "path": "../registry" },
    { "id": "local", "type": "inline", "lines": [{ "kind": "component", ... }] }
  ]
}
```

## Outputs

```json
{
  "sources": [
    {
      "registryId": "official",
      "priority": 10,
      "jsonl": "...",
      "defaults": { "id": "official", "type": "http", "url": "https://..." }
    },
    {
      "registryId": "local",
      "lines": [{ "kind": "component", ... }]
    }
  ],
  "warnings": ["..."]
}
```

This component leaves error handling to the resolver: missing files or malformed
JSON are reported as warnings rather than thrown errors.
