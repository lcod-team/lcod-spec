<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://tests/script_run_slot@0.1.0

Validate that tooling/script@1 can call slots and record logs.

## Notes

Ensures `tooling/script@1` can invoke a child slot and emit log messages. The
script forwards a payload to the `child` slot, captures its result, and returns
both the success flag and the child output.
