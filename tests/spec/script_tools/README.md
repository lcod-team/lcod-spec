# script_tools

Validates the extended sandbox API of `tooling/script@1`:

- `api.config` reads nested configuration values and returns the entire config
  when called without a path.
- `api.run` invokes helper functions declared under `tools`, allowing scripts to
  compose lightweight logic without leaving the sandbox.
- Helper scripts can log via `api.log`, reuse `api.config`, and return rich
  payloads.

The main script doubles an input value through a helper, checks it with another
helper that consults the config, and returns the aggregated result.
