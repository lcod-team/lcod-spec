# Create a New Component

The component authoring flow is now “single-source”: every human-editable field
lives inside `lcp.toml` and the other artefacts (README, JSON Schemas, helper
files) are generated automatically. This keeps the repository friendly to LLMs
and prevents the drift we previously saw between TOML / schemas / Markdown.

## 1. Folder structure

Create a directory with at least:

- `lcp.toml` — canonical descriptor (schemaVersion `2.0`)
- `compose.yaml` — the component implementation

Optional folders can be added for native implementations (`impl/<lang>/`),
tests, assets, etc. Generated artefacts (README + schemas) will be written next
to these files.

## 2. Describe the component in `lcp.toml`

Use the new schema (see `schema/lcp.schema.json`) with the following layout:

```toml
schemaVersion = "2.0"
id = "lcod://tooling/value/default_array@0.1.0"
version = "0.1.0"
kind = "component"
summary = "Return the value when it is an array, otherwise fallback to a default array."

[palette]
category = "Utility"
icon = "mdi:format-list-bulleted"
tags = ["value", "array"]

[inputs.value]
summary = "Candidate list to normalise."
required = false
schema = "{}" # JSON fragment stored as a string

[inputs.fallback]
summary = "Fallback array when the original value is not an array."
schema = """
{ "type": "array" }
"""

[outputs.value]
summary = "Normalised array."
schema = """
{ "type": "array" }
"""

[documentation]
body = """
Extra Markdown appended after the generated sections (optional).
"""

[tool]
name = "default_array"
inputSchema = "schema/default_array.in.json"
outputSchema = "schema/default_array.out.json"
```

Key points:

- `inputs.*.schema`, `outputs.*.schema`, and `slots.*.schema` hold JSON encoded
  as multi-line TOML strings. The build step will parse and validate them.
- Per-locale overrides live under `inputs.foo.locales.fr.summary`, etc.
- `documentation.body` stores any additional Markdown you want appended after
  the auto-generated sections.
- Keep `tool.inputSchema` / `tool.outputSchema` stable so downstream tooling
  keeps its relative paths (the generator will overwrite the files).

## 3. Generate artefacts

Run:

```bash
npm run build:components
```

This regenerates for every component:

- `README.md` (with a banner reminding contributors it is generated),
- JSON Schemas for inputs/outputs at the paths declared in `[tool]`.

You should run this after editing any `lcp.toml`.

## 4. Validate

`npm run validate` (or `make validate`) checks that:

- each `lcp.toml` matches `schema/lcp.schema.json`,
- the embedded JSON fragments parse correctly,
- generated schemas and READMEs exist,
- YAML/JSON files referenced by the component are valid.

The CI pipeline runs the same validation to guarantee consistency.
