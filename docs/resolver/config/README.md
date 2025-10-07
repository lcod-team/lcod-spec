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

Resolvers load this configuration (default `resolve.config.json` at project root). Unknown keys are ignored. A sample file lives in `examples/tooling/resolver/resolve.config.json`.

## Source types

The `sources` map associates a dependency identifier with a retrieval policy:

- **Path** — `{ "type": "path", "path": "./relative/or/absolute" }` resolves components from the local filesystem.
- **Git** — `{ "type": "git", "url": "...", "ref": "main", "subdir": "packages/app", "depth": 1, "force": false }` clones the repository, optionally targeting a specific ref or sub-directory. When omitted, the resolver falls back to registry lookup.
- **HTTP/Archive** — `{ "type": "http", "url": "...", "descriptorPath": "inner/lcp.toml", "filename": "component.tar", "force": false }` downloads artifacts via `http/download@1`. Files land under `./.lcod/cache/http/<hash>` (or `$LCOD_CACHE_DIR`, then `~/.cache/lcod`) and are reused unless `force` is set.

For all source types, the resolver computes a SHA-256 integrity string for `lcp.toml` (`sha256-…`) and includes it in the lockfile. Dependants may override the cache root with the `LCOD_CACHE_DIR` environment variable.
