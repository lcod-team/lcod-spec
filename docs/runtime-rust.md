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
│   │   ├── http.rs         # placeholder for HTTP client (not yet implemented)
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
| HTTP (`core/http/request@1`) | 🚧 stub | Contract is registered but currently returns `NotImplemented` (`src/core/http.rs`). The blueprint describes expected semantics and the stub keeps call-sites compiling until a client is wired. |
| Git (`core/git/clone@1`) | 🚧 stub | Similar to HTTP: the contract is registered to unblock aliasing while the actual clone logic is pending implementation. |
| Resolver axioms (`axiom/path/join@1`, `axiom/json/parse@1`, …) | ✅ alias helpers | `register_resolver_axioms` exposes the aliases required by the resolver example. HTTP/Git related axioms still bubble the stub error. |

The stubs allow downstream compositions to detect missing features explicitly rather than failing with “function not found”. Once the native bindings are ready we can replace the stub bodies in place without changing call-sites.

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
- a stubbed `axiom/http/download@1` that currently reports “not yet implemented”.

This is enough for the resolver example in `lcod-spec/examples/tooling/resolver/compose.yaml` to execute until it reaches the HTTP/Git boundary.

## Next steps (tracked on the roadmap)

1. **Wire native HTTP client bindings** — decide on the networking stack (`curl` via libgit2, `reqwest` behind an optional feature, or a pure-Rust client compatible with the current toolchain) and return buffered or streamed responses matching the contract.
2. **Implement Git clone support** — reuse libgit2 via `git2` crate or spawn `git` as a subprocess; handle `ref`, `depth`, and `subdir` inputs.
3. **Expose resolver download helpers** — once HTTP and Git are implemented, promote `axiom/http/download@1` to a real implementation and feed it into the resolver compose.
4. **Packaging** — split reusable bindings into a crate analogous to the Node `@lcod/core-node-axioms` bundle so host applications can depend on the Rust substrate without pulling the demo harness.

Until these steps are completed, the stubs keep the API surface stable and make it clear which contracts still require work.
