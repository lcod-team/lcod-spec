<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://tooling/resolver@0.1.0

Composite resolver that produces lcp.lock from lcp.toml using filesystem/network axioms.

## Notes

Prototype composite that resolves dependencies declared in `lcp.toml` and emits an `lcp.lock`. It reuses the resolver helper components (`lcod://tooling/resolver/internal/load-descriptor@0.1.0`, `load-config`, `lock-path`, `build-lock`) shipped alongside the `lcod-resolver` project.

> To run the example locally, point the resolver config to the helper components in the neighbouring repo, for instance:
>
> ```json
> {
>   "sources": {
>     "lcod://tooling/resolver/internal/load-descriptor@0.1.0":     { "type": "path", "path": "../../../../lcod-resolver/packages/resolver/components/internal/load_descriptor" },
>     "lcod://tooling/resolver/internal/load-config@0.1.0":         { "type": "path", "path": "../../../../lcod-resolver/packages/resolver/components/internal/load_config" },
>     "lcod://tooling/resolver/internal/lock-path@0.1.0":           { "type": "path", "path": "../../../../lcod-resolver/packages/resolver/components/internal/lock_path" },
>     "lcod://tooling/resolver/internal/build-lock@0.1.0":          { "type": "path", "path": "../../../../lcod-resolver/packages/resolver/components/internal/build_lock" },
>     "lcod://tooling/resolver/internal/prepare-config@0.1.0":      { "type": "path", "path": "../../../../lcod-resolver/packages/resolver/components/internal/prepare_config" },
>     "lcod://tooling/resolver/internal/prepare-cache@0.1.0":       { "type": "path", "path": "../../../../lcod-resolver/packages/resolver/components/internal/prepare_cache" },
>     "lcod://tooling/resolver/internal/resolve-dependencies@0.1.0":{ "type": "path", "path": "../../../../lcod-resolver/packages/resolver/components/internal/resolve_dependencies" },
>     "lcod://tooling/resolver/internal/summarize-result@0.1.0":    { "type": "path", "path": "../../../../lcod-resolver/packages/resolver/components/internal/summarize_result" }
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
