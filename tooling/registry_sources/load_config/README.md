<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
<p><img src="https://api.iconify.design/mdi:file-search.svg?height=48&width=48" alt="Load and parse the registry sources manifest, applying default fallbacks when the file is missing." width="48" height="48" /></p>

# lcod://tooling/registry_sources/load_config@0.1.0

Load and parse the registry sources manifest, applying default fallbacks when the file is missing.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `projectRoot` | string | Yes | Resolved project root directory. |
| `sourcesPath` | string | No | Optional explicit path to the sources manifest (lcod.sources.jsonl or legacy sources.json). |
| `sourcesText` | string | No | Raw manifest content supplied by the caller (legacy JSON format). |
| `defaultSourcesSpec` | object | No | Built-in sources specification used when the file is missing. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `sourcesConfig` | object | Parsed sources configuration (null when invalid). |
| `sourcesPath` | string | Effective path label for the sources configuration (file path or builtin label). |
| `sourcesBaseDir` | string | Directory used to resolve relative catalogue pointers. |
| `warnings` | array | Warnings emitted while loading/reading the configuration. |
| `valid` | boolean | Indicates whether the configuration was parsed successfully. |

## Notes

Load the registry sources manifest (`lcod.sources.jsonl` preferred, `sources.json`
legacy fallback). The component resolves the effective file path, detects which
format is present, and produces a normalized configuration for downstream
registry helpers while surfacing recoverable warnings.
