<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
<p><img src="https://api.iconify.design/mdi:source-branch.svg?height=48&width=48" alt="Resolve a registry pointer entry and emit catalogue lines or nested pointers." width="48" height="48" /></p>

# lcod://tooling/registry_sources/process_pointer@0.1.0

Resolve a registry pointer entry and emit catalogue lines or nested pointers.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `pointer` | object | Yes | Pointer descriptor being processed. |
| `downloadsRoot` | string | No | Filesystem root for cached downloads. |
| `defaultEntrypoint` | object | No | Fallback entrypoint definition inherited from parent lists. |
| `basePriority` | integer | No | Priority inherited from parent lists. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `entry` | object | null | Inline registry entry describing resolved catalogue lines. |
| `children` | array | Normalized child pointers produced while processing the catalogue. |
| `warnings` | array | Warnings emitted while resolving the pointer. |
| `commit` | string | null | Resolved commit hash associated with the pointer source. |
| `slots` | array | Child pointer slots to enqueue for further resolution. |

## Notes

Resolves a registry pointer (file, HTTP, or git reference), loads the referenced manifest, and emits either inline catalogue lines or new child pointers. The component also downloads remote manifests to a cache directory, keeps track of provenance metadata, and surfaces warnings when payloads are malformed.
