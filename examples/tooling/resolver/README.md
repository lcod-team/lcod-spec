# tooling/resolver

Prototype composite that resolves dependencies declared in `lcp.toml` and emits an `lcp.lock`. It relies on host-provided axioms for filesystem, Git/HTTP access, hashing, and JSON/TOML conversions.

Inputs (`schema/resolve.in.json`):
- `projectPath`: directory containing `lcp.toml`
- `configPath`: optional resolver configuration (mirrors, replacements)
- `outputPath`: optional explicit lockfile location

Outputs (`schema/resolve.out.json`):
- `lockPath`: path to the generated lockfile
- `components`: array of resolved components (minimal metadata in this example)
- `warnings`: list of warnings emitted during resolution

Required dependencies:
- Filesystem axioms (`lcod://axiom/fs/*`)
- Path helpers (`lcod://axiom/path/join@1`)
- TOML/JSON tooling (`lcod://axiom/toml/*`, `lcod://axiom/json/parse@1`)
- Network/SCM primitives (`lcod://axiom/git/clone@1`, `lcod://axiom/http/download@1`)
- Hashing (`lcod://axiom/hash/sha256@1`)
- Flow operators (`if`, `foreach`, `try`, `parallel`)
- Contract `lcod://contract/tooling/resolve-dependency@1` which host-specific packages must implement to resolve individual dependencies.

The `compose.yaml` illustrates the intended control flow, while actual implementations of the axioms will live in runtime-specific packages.
