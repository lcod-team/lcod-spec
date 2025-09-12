# Tool Schemas Guidance

Each block exposes a tool interface described by JSON Schemas.

- `tool.inputSchema` — JSON Schema path for the input
- `tool.outputSchema` — JSON Schema path for the output

Guidelines:
- Use explicit required fields; avoid permissive `additionalProperties: true` unless necessary.
- Model domain errors via transport (throw) or by returning a discriminated union at the schema level.
- Favor primitive, serializable types and stable field names.

Example input schema:
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "required": ["url"],
  "properties": {
    "url": { "type": "string", "format": "uri" },
    "headers": { "type": "object", "additionalProperties": { "type": "string" } },
    "timeoutMs": { "type": "integer", "minimum": 0 }
  }
}
```

Example output schema:
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "required": ["status", "body"],
  "properties": {
    "status": { "type": "integer", "minimum": 100, "maximum": 599 },
    "body": { "type": "string" },
    "headers": { "type": "object", "additionalProperties": { "type": "string" } }
  }
}
```

