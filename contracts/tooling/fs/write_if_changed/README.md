<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://contract/tooling/fs/write_if_changed@1.0.0

Write text to a file only when the contents change.

## Notes

Normalises the provided content to a string, compares it with the current file
contents (using the requested encoding) and writes the file only when the data
changes. The contract reports whether the file was modified.
