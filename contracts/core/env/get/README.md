<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://contract/core/env/get@1.0.0

Read an environment variable from the current process.

## Notes

Resolve an environment variable and optionally fall back to a provided default.

## Input (`schema/get.in.json`)
- `name` (string, required): variable name.
- `default` (string|null, optional): value to use when the variable is not defined.
- `required` (boolean, optional): when true, throw an error if the variable is missing.
- `expand` (boolean, optional): expand `${VAR}` tokens inside the resolved value by looking up additional variables (single-pass).

## Output (`schema/get.out.json`)
- `exists` (boolean): indicates whether the variable was present in the environment.
- `value` (string|null): resolved value, default, or `null`.
