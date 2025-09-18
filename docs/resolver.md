# Resolver Composite

Goal: provide a reusable resolver expressed in the LCOD DSL, relying on pluggable axioms for filesystem and network. The resolver reads `lcp.toml`, applies configuration rules, and produces `lcp.lock`.

## Components

- `lcod://tooling/resolver@0.1.0` (workflow) — defined in `examples/tooling/resolver`
- `lcod://contract/tooling/resolve-dependency@1` — contract for resolving a single dependency according to platform policy (fetch source, compute integrity, emit bindings).

## Required axioms (per host)

| Axiom | Purpose |
|-------|---------|
| `lcod://axiom/fs/read-file@1`, `write-file@1` | Read/write local files |
| `lcod://axiom/path/join@1` | Path normalization |
| `lcod://axiom/json/parse@1`, `lcod://axiom/toml/parse@1`, `lcod://axiom/toml/stringify@1` | Config and descriptor parsing |
| `lcod://axiom/git/clone@1`, `lcod://axiom/http/download@1` | Fetch sources from Git/HTTP |
| `lcod://axiom/hash/sha256@1` | Integrity hashing |

Hosts provide implementations of these axioms appropriate for their runtime (Node.js, Rust, Java…).

## Flow overview

1. Locate `lcp.toml` under `projectPath` and parse it.
2. Load optional `resolve.config.json` with mirror/replace rules.
3. Iterate over `deps.requires`, delegating to `tooling/resolve-dependency@1` to resolve each dependency.
4. Assemble the lockfile object (schemaVersion, resolverVersion, components) and persist it via `fs/write-file`.

The contract `tooling/resolve-dependency@1` receives:

```
{
  "dependency": "lcod://core/localisation@1",
  "config": { ... },
  "projectPath": "/abs/project"
}
```

and returns metadata:

```
{
  "resolved": {
    "id": "lcod://core/localisation@1.2.0",
    "source": { "type": "git", "url": "…", "rev": "…" },
    "integrity": "sha256-…"
  },
  "warnings": []
}
```

Resolvers may bind contracts to implementations (
`bindings` array in the lockfile) when projects choose specific impls.

## Example

See `examples/tooling/resolver/` for the current prototype composition, schemas, and README.

## Next steps

- Provide implementations for `tooling/resolve-dependency@1` tailored to different backends.
- Package the resolver composite as a sharable component in the registry.
- Integrate with `.lcpkg` packaging for source distribution.
