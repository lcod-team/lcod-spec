<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://tests/foreach_ctrl_demo@0.1.0

Validate the foreach_ctrl_demo compose using tooling/test_checker.

## Notes

Runs the `examples/flow/foreach_ctrl_demo` compose through the
`tooling/test_checker@1` contract. The test feeds the same input as the demo and
expects the loop to collect `[1, 3]`.

This fixture is intended to be consumed by runtimes (Node, Rust, …) so they all
share the exact same assertions.
