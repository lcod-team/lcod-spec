# Resolver Configuration

Format: JSON object with `sources`, `mirrors`, `replace`, `bindings`.

Example:
```json
{
  "sources": {
    "lcod://core/localisation@1": { "type": "git", "url": "https://...", "rev": "abc123" }
  },
  "mirrors": {
    "https://registry.lcod.dev": "https://mirror.example.com"
  },
  "replace": {
    "lcod://impl/net/fetch@1": "lcod://org/custom-fetch@1"
  },
  "bindings": {
    "lcod://contract/net/http-client@1": "lcod://impl/net/fetch@1.2.0"
  }
}
```

Resolvers load this configuration (default `resolve.config.json` at project root). Unknown keys are ignored.
