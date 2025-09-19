# Resolver Axioms / Bindings

This directory documents the axioms required by the resolver composite. Each runtime (Node.js, Rust, Java …) provides implementations under its own package. The resolver composite calls these axioms via their canonical IDs.

## Required operations

- Filesystem: `lcod://axiom/fs/read-file@1`, `write-file@1`
- Paths: `lcod://axiom/path/join@1`
- JSON/TOML: `lcod://axiom/json/parse@1`, `lcod://axiom/toml/parse@1`, `lcod://axiom/toml/stringify@1`
- Network/SCM: `lcod://axiom/git/clone@1`, `lcod://axiom/http/download@1`
- Hashing: `lcod://axiom/hash/sha256@1`
- Utility: `lcod://impl/set@1`
- Contract: `lcod://contract/tooling/resolve-dependency@1`

Providers must document argument structure, return values, and error handling.
