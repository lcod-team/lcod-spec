<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://tests/core_fs_roundtrip@0.1.0

Validate core/fs read, write and list contracts end-to-end.

## Notes

Ensures the `core/fs` contracts can write, read and list files within the
sandbox. The harness writes to a local temporary directory, reads the content
back and verifies the entry appears in the directory listing.
