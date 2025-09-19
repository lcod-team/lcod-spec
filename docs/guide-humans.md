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

## Contribution tips
- Keep descriptors and docs in sync.
- Add tests under `tests/unit/`.
- Document runtime hints and configuration clearly.
- Use the packaging and resolver scripts for reproducible demos.
