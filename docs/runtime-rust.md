# Rust Substrate Blueprint

This note tracks the state of the Rust reference substrate (`lcod-kernel-rs`) and how it maps to the LCOD runtime contracts. It complements the Node.js substrate documentation and serves as the blueprint for Milestone **M3-04 — Rust substrate blueprint**.

## Layout

```
lcod-kernel-rs/
├── src/
│   ├── compose.rs          # YAML compose interpreter
│   ├── core/               # Contract bindings
│   │   ├── fs.rs           # filesystem contracts (read/write/list)
│   │   ├── hash.rs         # hashing (`core/hash/sha256@1`)
│   │   ├── http.rs         # HTTP client based on libcurl (buffered + stream modes)
│   │   ├── parse.rs        # JSON/TOML/CSV parsing helpers
│   │   └── streams.rs      # Async stream handles (`core/stream/*`)
│   ├── flow/               # Flow operator implementations
│   ├── impls/demo.rs       # Demo implementations for examples/tests
│   ├── registry.rs         # Registry/Context plumbing (contracts + slot orchestration)
│   ├── streams.rs          # In-memory stream manager used by `core/stream/*`
│   └── tooling/            # Shared tooling contracts (`tooling/test_checker`, `tooling/script`)
├── tests/                  # Integration tests shared with the spec fixtures
└── src/bin/test_specs.rs   # Harness to execute `lcod-spec/tests/spec` fixtures via Rust
```

`src/lib.rs` re-exports the key entrypoints:

- `register_core(&Registry)` — registers all core contracts currently implemented.
- `register_flow(&Registry)` — registers flow operators (`if`, `foreach`, `try`, …).
- `register_tooling(&Registry)` — tooling helpers (`tooling/test_checker@1`, `tooling/script@1`).
- `register_resolver_axioms(&Registry)` — helper introduced for the resolver example; it aliases core contracts under their `axiom://` identifiers and exposes small helper axioms (e.g. `path/join`).

## Contract coverage snapshot (September 2025)

| Area                | Status | Notes |
|---------------------|--------|-------|
| Filesystem (`core/fs/*`) | ✅ implemented | read/write/list parity with Node substrate; exercises in `tests/core_contracts.rs` |
| Hashing (`core/hash/sha256@1`) | ✅ implemented | Supports string, base64, and file inputs |
| Parsing (`core/parse/{json,toml,csv}@1`) | ✅ implemented | Uses `serde_json`, `toml`, and `csv` crates |
| Streams (`core/stream/read@1`, `core/stream/close@1`) | ✅ implemented | In-memory chunk registry matching the JS substrate semantics |
| HTTP (`core/http/request@1`) | ✅ implemented | Uses the `curl` crate to issue requests, honours headers/query/body encodings, and supports buffered or streamed responses. |
| Git (`core/git/clone@1`) | ✅ implemented | Backed by `git2`/libgit2 with support for `ref`, `depth`, `subdir` and deterministic destinations. |
| Resolver axioms (`axiom/path/join@1`, `axiom/json/parse@1`, …) | ✅ alias helpers | Includes a real `axiom/http/download@1` that streams via the core HTTP contract before persisting to disk. |

All core infrastructure contracts are now available behind `register_core`, which means resolver-style composites can run end-to-end without hitting “function not found” placeholders.

## Using the crate locally

```bash
# Run the kernel unit tests + shared spec fixtures
cargo test

# Execute the compose fixtures shipped in lcod-spec/tests/spec
SPEC_REPO_PATH=/path/to/lcod-spec cargo run --bin test_specs
```

The test harness mirrors the JavaScript substrate’s behaviour and ensures parity for flow operators, stream handling, and scripting.

## Resolver helper (`register_resolver_axioms`)

Located in `src/tooling/resolver.rs`, the helper registers:

- aliases for core contracts under their `axiom://` identifiers (filesystem, parsing, hashing);
- a small `path/join` helper used by the resolver compose;
- a streaming `axiom/http/download@1` implementation that proxies requests through the core HTTP contract and writes to disk (`fs/write-file@1`).

With these bindings in place the resolver example in `lcod-spec/examples/tooling/resolver/compose.yaml` now runs entirely on the Rust substrate.

## Next steps (tracked on the roadmap)

1. **Conformance harness** — extend `cargo run --bin test_specs` to diff traces against the Node substrate (M3-05).
2. **Contract packaging** — split the reusable bindings into a crate analogous to `@lcod/core-node-axioms` so hosts can depend on a stable set of Rust axioms (M3-04b follow-up).
3. **Auth and advanced transports** — layer optional credential helpers for Git/HTTP once the core scenarios are validated.
