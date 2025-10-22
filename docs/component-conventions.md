# Component Conventions

This guide defines the metadata expected in every LCOD component so IDEs,
registries and automation tools can surface a consistent palette. Repositories
such as `lcod-components` or application-specific catalogues should follow the
principles below.

## Folder layout

```
components/<namespace>/<name>/
  lcp.toml        # descriptor (identity, metadata, dependencies)
  compose.yaml    # implementation (for composites/flows)
  README.md       # generated from lcp.toml (do not edit directly)
  schema/         # generated JSON Schemas for tool invocation
  tests/          # optional declarative tests (JSON)
  assets/         # optional icons or supporting artefacts (SVG, images)
```

## Descriptor metadata (`lcp.toml`)

`lcp.toml` is the **single source of truth**. All human-authored metadata must
live here so the generator (`npm run build:components`) can derive the README
and JSON Schemas reliably.

```toml
schemaVersion = "2.0"
id = "lcod://tooling/registry/catalog@0.1.0"
version = "0.1.0"
kind = "component"
summary = "Load a registry catalogue from disk or HTTP and return normalised entries."

[palette]
category = "Registry"
icon = "mdi:database-cog-outline"   # mdi:<name> or relative path to SVG
tags = ["catalog", "resolver"]

[inputs.rootPath]
summary = "Base path used to resolve relative catalogue files."
schema = """
{ "type": "string" }
"""

[inputs.catalogues]
summary = "List of catalogue URLs or inline overrides."
schema = """
{
  "type": "array",
  "items": { "type": "string" }
}
"""

[outputs.packagesJsonl]
summary = "JSON Lines text listing registry and component entries."
schema = """
{ "type": "string" }
"""

[documentation]
body = """
Add any long-form Markdown (examples, troubleshooting) here. The generator will
place it after the structured sections in the README.
"""
```

- `summary` and `[palette]` remain the primary hints for IDE palettes.
- `inputs.*`, `outputs.*` and `slots.*` hold JSON Schema fragments **as strings**.
  The generator parses them, validates the JSON and assembles the tool schemas.
- Use `*.locales.<locale>.summary` / `description` to provide translations.
- Place longer Markdown in `documentation.body`; the builder injects it into
  the generated README.
- Declare tool bindings via `[tool]` and keep the schema paths stable. The
  build step overwrites the JSON files each time.

## Tests

Prefer declarative tests (`tests/*.json`) when possible. These tests can be
run by both kernels and ensure component behaviour stays consistent across
implementations.

## Palette automation

Future tooling (`tooling/components/publish`) will parse the metadata above to
generate a palette index that IDEs and registries can consume. Keeping the
descriptors consistent today guarantees that the automation can be plugged on
top without refactoring later.
