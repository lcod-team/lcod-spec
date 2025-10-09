# Resolver Composite

Goal: provide a reusable resolver expressed in the LCOD DSL, relying on pluggable axioms for filesystem and network. The resolver reads `lcp.toml`, applies configuration rules, and produces `lcp.lock`.

## Components

- `lcod://tooling/resolver@0.1.0` (workflow) — defined in `examples/tooling/resolver`
- `lcod://tooling/resolver/cache-dir@1` — axiom returning the cache directory to use for Git/HTTP artifacts, honouring project `.lcod/cache`, `$LCOD_CACHE_DIR`, or the user cache.

The composite now resolves local paths, Git repositories and HTTP archives entirely inside the LCOD DSL. A `tooling/script@1` step (with import aliases) orchestrates descriptor loading, cache management, and integrity hashing while aggregating warnings in the generated lockfile. When configuration is missing the compose falls back to an empty `sources` map and records a warning so hosts can surface the issue. The historical contract `lcod://contract/tooling/resolve-dependency@1` remains available as a stub for compatibility but is no longer part of the resolver flow.

## Required axioms (per host)

| Axiom | Purpose |
|-------|---------|
| `lcod://axiom/fs/read-file@1`, `write-file@1` | Read/write local files |
| `lcod://axiom/path/join@1` | Path normalization |
| `lcod://axiom/json/parse@1`, `lcod://axiom/toml/parse@1`, `lcod://axiom/toml/stringify@1` | Config and descriptor parsing |
| `lcod://axiom/git/clone@1`, `lcod://axiom/http/download@1` | Fetch sources from Git/HTTP |
| `lcod://axiom/hash/sha256@1` | Integrity hashing |
| `lcod://tooling/resolver/cache-dir@1` | Resolve the cache directory used by the compose |

Hosts provide implementations of these axioms appropriate for their runtime (Node.js, Rust, Java…).

## Flow overview

1. Locate `lcp.toml` under `projectPath`, compute its integrity hash, and parse it.
2. Load optional `resolve.config.json` (explicit `configPath` or default project file). Missing configs trigger a warning but the compose continues with an empty `sources` map.
3. Iterate over `deps.requires` inside the resolver script, using import aliases to call filesystem, hash, Git and HTTP axioms. Cached artifacts live under `./.lcod/cache` by default (overridable via `$LCOD_CACHE_DIR`, then `~/.cache/lcod`).
4. Assemble the lockfile object (schemaVersion, resolverVersion, components) and persist it via `fs/write-file`. The root component captures its dependency tree so consumers can traverse the graph without re-running resolution.

CLI helpers (`bin/run-compose.mjs` in Node, `cargo run --bin run_compose` in Rust) expose
`--project`, `--config`, `--output` and `--cache-dir` to populate the resolver state without
crafting a JSON file; explicit flags override values pulled from `--state`.

Resolvers may still bind contracts to implementations (`bindings` array in the lockfile) when
projects choose specific impls, but the compose itself already produces the dependency graph and
integrity metadata.

## Example

See `examples/tooling/resolver/` for the current prototype composition, schemas, and README.

Additional documentation:
- `docs/resolver/config/README.md` — Configuration format (sources, mirrors, bindings)
- `docs/resolver/axioms/README.md` — List of required axioms / reference implementations
- `docs/resolver/examples/README.md` — Placeholder for future end-to-end demos
- `docs/resolver/contracts/README.md` — Contract `tooling/resolve-dependency@1` specification

## Cache policy

By default the resolver writes fetched artifacts to `./.lcod/cache`. Runtimes can override the location with the `LCOD_CACHE_DIR` environment variable; if neither is available the resolver falls back to `~/.cache/lcod`. Cache entries are grouped by source type (`git/<hash>`, `http/<hash>`), enabling reuse across repeated runs while keeping project-local workflows hermetic.

## Next steps

- Provide implementations for `tooling/resolve-dependency@1` tailored to different backends.
- Package the resolver composite as a sharable component in the registry.
- Integrate with `.lcpkg` packaging for source distribution.
- Finalise registry scope chaining (compose → project → platform) so helper components stay local by default.
- Add metadata to distinguish public catalogue components from internal helpers when publishing the resolver bundle.
