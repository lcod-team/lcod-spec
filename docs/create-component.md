# Create a New Component

> Consultez également `docs/component-conventions.md` pour la liste des champs
> attendus (summary, palette, inputs/outputs, README). Toutes les bases de
> composants doivent s’y conformer afin de rester compatibles avec la palette
> et les outils d’automatisation.

1) Create the folder structure

- `lcp.toml` at the root
- `schema/` for input/output schemas
- optional: `impl/<lang>/`, `tests/unit/`, `assets/`, `doc_assets/`

2) Fill `lcp.toml`

- Set `schemaVersion`, `id` (canonical), `name`, `namespace`, `version`, `kind`.
- Add `[tool]` with `name`, `description`, `inputSchema`, `outputSchema`.
- Optionally add `[hints]`, `[deps]`, `[docs]`, `[implMatrix]`, `[ui]`.

3) Author JSON Schemas

- Keep them strict (`additionalProperties: false` where possible).
- Include `required` lists.

4) Validate

- Run `make validate` to check basics (IDs, files, JSON). In CI, Ajv validates against `schema/lcp.schema.json`.
