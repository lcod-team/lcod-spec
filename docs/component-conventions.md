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
  README.md       # human-friendly summary and examples
  schema/         # optional JSON Schemas when inputs/outputs are non-trivial
  tests/          # optional declarative tests (JSON)
  assets/         # optional icons or supporting artefacts (SVG, images)
```

## Descriptor metadata (`lcp.toml`)

Extend the base schema with the following fields:

```toml
summary = "One-line description shown in palettes."

[palette]
category = "Registry"
icon = "mdi:database-cog-outline"   # mdi:<name> or relative path to SVG
tags = ["catalog", "resolver"]      # optional facet hints

[docs]
readme = "README.md"                # optional long-form documentation

[[io.input]]
name = "rootPath"
type = "string"
required = false
description = "Base path used to resolve relative catalog files."

[[io.output]]
name = "packagesJsonl"
type = "string"
description = "JSON Lines text listing registry and component entries."
```

- `summary` and `[palette]` allow editors to render the component in a palette
  with a dedicated icon and category.
- `[[io.input]]` / `[[io.output]]` describe the interface succinctly. For
  complex shapes, place canonical JSON Schemas under `schema/` and reference
  them via `tool.inputSchema` / `tool.outputSchema`.
- `README.md` should provide longer examples, edge cases or troubleshooting
  notes. Keep it concise so the IDE can display it inline.

## Tests

Prefer declarative tests (`tests/*.json`) when possible. These tests can be
run by both kernels and ensure component behaviour stays consistent across
implementations.

## Palette automation

Future tooling (`tooling/components/publish`) will parse the metadata above to
generate a palette index that IDEs and registries can consume. Keeping the
descriptors consistent today guarantees that the automation can be plugged on
top without refactoring later.
