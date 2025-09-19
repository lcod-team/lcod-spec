# Guide for AI Assistants

## Goals
- Explore the component catalogue (`lcp.toml`, README, schemas).
- Suggest compositions (`compose.yaml`) with precise bindings.
- Update lockfiles and packages when dependencies change.

## Tools & prompts
- Use repository traversal tools (list files, read docs) to understand available components.
- Follow the structure described in [docs/compose-dsl.md](compose-dsl.md) when generating flows.
- When resolving dependencies, call the resolver composite or the CLI (`npm run resolve`).
- For packaging, run `node scripts/pack-lcp.cjs <component>`.

## Best practices
- Prefer existing components before inventing new ones. Check index via search.
- Include documentation snippets in the descriptors you generate.
- If an axiom or contract is missing, create a proposal in `docs/resolver/` or `docs/contracts-and-impls.md`.
- Keep lockfiles consistent with `deps.requires`.

## Limits
- Runtime execution requires choosing the appropriate kernel (TS, Rust, …). Document your assumptions.
- Sensitive data or proprietary repositories should be handled according to organisation policy.
