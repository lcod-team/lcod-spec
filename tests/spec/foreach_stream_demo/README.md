<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://tests/foreach_stream_demo@0.1.0

Validate the foreach_stream_demo compose using tooling/test_checker.

## Notes

Runs the `examples/flow/foreach_stream_demo` compose via
`tooling/test_checker@1`. The test injects a synthetic UTF-8 stream emitting the
chunks `"12"`, `"34"`, and `"56"` and expects the loop to collect these values
before closing the handle.
