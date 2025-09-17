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
