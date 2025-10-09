# tooling/resolver

Prototype composite that resolves dependencies declared in `lcp.toml` and emits an `lcp.lock`. It reuses the resolver helper components (`lcod://resolver/internal/load-descriptor@1`, `load-config`, `lock-path`, `build-lock`) shipped alongside the `lcod-resolver` project.

> To run the example locally, point the resolver config to the helper components in the neighbouring repo, for instance:
>
> ```json
> {
>   "sources": {
>     "lcod://resolver/internal/load-descriptor@1": { "type": "path", "path": "../lcod-resolver/components/internal/load_descriptor" },
>     "lcod://resolver/internal/load-config@1":     { "type": "path", "path": "../lcod-resolver/components/internal/load_config" },
>     "lcod://resolver/internal/lock-path@1":       { "type": "path", "path": "../lcod-resolver/components/internal/lock_path" },
>     "lcod://resolver/internal/build-lock@1":      { "type": "path", "path": "../lcod-resolver/components/internal/build_lock" }
>   }
> }
> ```

Inputs (`schema/resolve.in.json`):
- `projectPath`: directory containing `lcp.toml`
- `configPath`: optional resolver configuration (mirrors, replacements)
- `outputPath`: optional explicit lockfile location

Outputs (`schema/resolve.out.json`):
- `lockPath`: path to the generated lockfile
- `components`: array of resolved components (minimal metadata in this example)
- `warnings`: list of warnings emitted during resolution

Required dependencies (in addition to the helper components):
- Filesystem write axiom (`lcod://axiom/fs/write-file@1`)
- Flow `foreach` operator
- Contract `lcod://contract/tooling/resolve-dependency@1` which host-specific packages must implement to resolve individual dependencies.

The `compose.yaml` illustrates the intended control flow, while actual implementations of the axioms will live in runtime-specific packages.
