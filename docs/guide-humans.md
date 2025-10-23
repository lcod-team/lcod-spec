# Guide for Humans

## Who should read this?
Product designers, engineers, and contributors who extend the LCOD catalogue or build tooling around it.

## Key resources
- Start with [OVERVIEW.md](OVERVIEW.md) for the architecture.
- Follow [docs/create-component.md](create-component.md) to add a new block.
- Use [docs/quickstart.md](quickstart.md) to validate and run examples.
- Roadmap and issues live in this repository.

## Workflow
1. Author components (`lcp.toml`, schemas, implementations).
2. Compose flows via `compose.yaml` or IDE/editor.
3. Generate lockfiles (`lcp.lock`) and packages (`.lcpkg`).
4. Provide resolver/axiom implementations for your runtime if needed.

### Standard development cycle
1. Align with the relevant roadmap item and open / link the tracking issue.
2. Implement the change (spec, resolver, kernels, packages) in a focused branch.
3. Run the associated local tests or scripts (e.g. `cargo test`, `npm run export:components`).
4. Commit with a message referencing the issue, then push to `main` (or the PR branch).
5. Monitor the affected CI workflows (Validate, Verify Components, Rust tests, etc.) and address regressions immediately.

## Contribution tips
- Keep descriptors and docs in sync.
- Add tests under `tests/unit/`.
- Document runtime hints and configuration clearly.
- Use the packaging and resolver scripts for reproducible demos.
