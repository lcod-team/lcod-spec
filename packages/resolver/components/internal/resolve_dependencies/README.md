# resolve-dependencies

Builds the dependency graph for the resolver. It consumes the normalised configuration (sources, replacements, allowlist), the computed cache root, and the root descriptor to fetch each dependency, apply overrides, detect cycles, and collect warnings.

## Inputs

- `projectPath` (string): base project path.
- `cacheRoot` (string): resolved cache directory.
- `normalizedConfig` (object): output of `prepare-config` containing `sources`, `replaceAlias`, `replaceSpec`, `allowlist`.
- `rootId` (string, optional): explicit root component identifier.
- `rootDescriptor` (object): parsed descriptor.
- `rootDescriptorText` (string): raw descriptor text (for integrity hashes).
- `warnings` (array of strings, optional): warnings accumulated so far.

## Outputs

- `resolverResult` (object): `{ root, warnings }` where `root` is the resolved dependency tree.
- `warnings` (array of strings): warnings produced during resolution (includes input warnings).
