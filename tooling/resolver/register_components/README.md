<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://tooling/resolver/register_components@0.1.0

Register shared resolver helper components via the tooling/resolver/register axiom.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `specRoot` | string | null | No | Absolute path to the lcod-spec checkout containing helper components. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `registered` | integer | Number of components successfully registered. |
| `warnings` | array<string> | Warnings emitted while resolving or registering components. |
| `sources` | object | Map of component IDs to their resolved sources. |

## Notes

Registers shared resolver helper components (registry loaders, selectors, and resolver utilities) with the runtime. The component expects a `specRoot` pointing to the `lcod-spec` repository, resolves all compose paths relative to it, and calls `tooling/resolver/register@1` to publish each compose while aggregating warnings.
