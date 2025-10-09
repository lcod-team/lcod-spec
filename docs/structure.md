# LCP Package Structure

Recommended layout for a component package:

- `lcp.toml` — canonical descriptor (single source of truth)
- `schema/` — JSON Schemas for `tool.inputSchema`, `tool.outputSchema`, optional `ui.propsSchema`
- `impl/<lang>/` — implementation variants
  - `meta.toml` — targets and build hints (e.g., `node18`, `v21`)
  - `deps.json` — language‑agnostic runtime/test deps
  - `<target>/src/...` — actual source code
- `tests/unit/*.json` — declarative tests (inputs, expected outputs, axiom mocks)
- `assets/`, `doc_assets/` — runtime/docs assets
- `index.json` — optional index for non‑standard names

Notes:
- Set `schemaVersion = "1.0"` for all M0 packages.
- Prefer small, composable blocks with clear inputs/outputs.
- Keep `lcp.toml` minimal and refer to files in the package.
- Use SemVer for `version` and canonical IDs `lcod://namespace/path/name@version`.

## Workspaces (multi-package repositories)

Repositories can host several packages that share tooling and helper components. The recommended structure is:

- `workspace.lcp.toml` — declares shared metadata (default namespace, scope aliases, package list).
- `packages/<package>/` — one directory per published package, each following the layout above.
  - `lcp.toml` — package descriptor with `id`, `version`, `components`, etc.
  - `components/` — optional sub-directory for composable blocks (`public` or `scope = "workspace"`).
- `shared/` — optional directory for scripts, schemas or assets reused by multiple packages.
- `tests/` — cross-package scenarios and end-to-end fixtures.

Workspace-scoped components (`scope = "workspace"`) inherit the package version and can be referenced via short identifiers (e.g. `internal/load-config`). The resolver expands them to full IDs by combining the package coordinates with the scope alias (`lcod://tooling/resolver/internal/load-config@0.1.0`), so renaming or forking a repository only requires updating manifest metadata.
