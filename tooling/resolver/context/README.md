# resolver/context/prepare

Normalises resolver inputs before dependency resolution:

- merges warnings coming from previous steps and registry helpers;
- ensures `projectPath`/`cacheRoot` fallback to sensible defaults;
- sanitises `sources`, `replaceAlias`, `replaceSpec` objects so downstream components can rely on plain JSON structures;
- filters the optional allowlist to string entries or returns `null` when unset.

The component is a lightweight wrapper around a single `tooling/script@1` step so that kernels can reuse the same logic without duplicating boilerplate.

## Inputs

Refer to `schema/prepare.in.json` for the exhaustive structure. Most fields are optional and default to empty structures when missing.

## Outputs

See `schema/prepare.out.json`. The resulting `sources`, `replaceAlias`, and `replaceSpec` maps are deep-cloned plain objects suitable for serialisation.
