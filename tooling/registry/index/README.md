# Registry Index (`tooling/registry/index@0.1.0`)

Builds an ordered in-memory catalogue from one or more `packages.jsonl` streams.
Each stream corresponds to a registry (or a local override file) and may define:

- `{"kind":"registry", …}` lines that describe chained registries.
- `{"kind":"component", …}` lines that reference published component versions.

The component normalises all entries, attaches priority/order metadata, and
groups versions per component so resolvers can pick the newest compatible one.

## Behaviour

- Streams are processed in the given order. Lower `priority` wins; ties fall back
  to the declaration order of the JSON lines.
- `kind="registry"` entries are deduplicated by `id` (first occurrence wins) and
  inherit defaults provided alongside the stream (type, URL, priority).
- `kind="component"` entries inherit the stream `registryId` and may carry extra
  metadata (e.g. `artifact`). The component map groups versions sorted by
  `(priority, order)` so the resolver can do “first match wins” while honouring
  the original JSONL ordering.
- Blank lines or invalid JSON lines are ignored but reported in the `errors`
  output to aid debugging.

## Inputs

```json
{
  "sources": [
    {
      "registryId": "official",
      "priority": 10,
      "jsonl": "…",                 // raw JSON Lines content
      "lines": [ { "kind": "component", … } ], // optional pre-parsed entries
      "defaults": {                 // optional registry defaults
        "type": "http",
        "url": "https://registry.example.com"
      }
    }
  ]
}
```

`priority` defaults to `100`. When both `jsonl` and `lines` are provided their
entries are concatenated.

## Outputs

```json
{
  "registries": [
    { "id": "official", "type": "http", "url": "https://…", "priority": 10 }
  ],
  "entries": [
    { "id": "lcod://foo/bar", "version": "1.2.0", "manifest": "…", "registryId": "official", "priority": 10, "order": 0 }
  ],
  "packages": {
    "lcod://foo/bar": [
      { "id": "lcod://foo/bar", "version": "1.2.0", … },
      { "id": "lcod://foo/bar", "version": "1.1.0", … }
    ]
  },
  "errors": [ "line 4: invalid JSON" ]
}
```

Each `entries` item also includes the original JSON object under `raw` for
consumers that need additional metadata.

## Notes

- The component does not fetch remote files; callers must supply the JSONL
  content (from HTTP, Git, etc.) and any pre-parsed overrides.
- The resolver may concatenate multiple outputs (e.g. local overrides + official)
  by merging `registries`, concatenating `entries`, and merging `packages`.
