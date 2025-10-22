<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://tests/script_tools@0.1.0

Validate tooling/script@1 helpers (api.run/api.config).

## Notes

Validates the extended sandbox API of `tooling/script@1`:

- `api.config` reads nested configuration values and returns the entire config
  when called without a path.
- `api.run` invokes helper functions declared under `tools`, allowing scripts to
  compose lightweight logic without leaving the sandbox.
- Helper scripts can log via `api.log`, reuse `api.config`, and return rich
  payloads.
- Import aliases expose frequently used components (e.g. hashing) as
  `imports.<alias>()` helpers while keeping FQDN calls available through
  `api.call`.

The main script doubles an input value through a helper, checks it with another
helper that consults the config, computes a SHA-256 digest via an import alias,
and returns the aggregated result.
