<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://contract/core/object/merge@1.0.0

Merge two objects into a new structure without mutating the inputs.

## Notes

Merges two objects and returns a new object containing the combined properties.
By default the merge is shallow (top-level keys). When `deep` is enabled, nested
objects are merged recursively.
