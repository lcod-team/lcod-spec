# Conformance Manifest

The JSON manifest in this directory lists the canonical spec fixtures used by the
cross-runtime conformance suite. Each entry contains the human-readable `name`
and the relative path to the compose file under `tests/spec/`.

Both kernel runtimes consume this manifest when running their conformance
runners (`node scripts/run-spec-tests.mjs --manifest …` for Node,
`cargo run --bin test_specs -- --manifest …` for Rust). The spec-level harness
(`scripts/run-conformance.mjs`) uses the same manifest to run both runtimes and
diff their results.
