# Contract: tooling/resolve-dependency

Inputs:
- `dependency` (string) — canonical ID from `deps.requires`
- `config` (object) — resolver configuration with mirrors/replacements
- `projectPath` (string) — absolute path to project root

Outputs:
- `resolved` (object) — fields `id`, `source`, optional `integrity`, `bindings`
- `warnings` (array) — strings

The resolver computes `integrity` as `sha256-<base64>` over the dependency’s `lcp.toml`. When the descriptor cannot be read, an explanatory warning is emitted and the field is omitted.

Implementations may perform Git fetches, registry lookups, local path resolution, and compute hashes as needed.
