# load-config

Loads the resolver configuration JSON file, applies sensible defaults, and surfaces any warnings produced while reading the file.

## Inputs

- `projectPath` (string, required): Project root used to resolve the default `resolve.config.json`.
- `configPath` (string, optional): Custom configuration file path.

## Outputs

- `configPath` (string): Path that was used to load the configuration (default or custom).
- `config` (object): Normalised configuration with `sources`, `replace`, and `allowlist` fields.
- `warnings` (array of strings): Messages emitted during loading (e.g. missing file).
