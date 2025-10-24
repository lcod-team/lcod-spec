<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://contract/tooling/fs/read_optional@1.0.0

Read a text file when it exists, falling back to default content.

## Notes

Reads a text file with the supplied encoding. When the file is missing, the
contract returns the provided fallback text (if any) and marks `exists = false`.
Any warning message supplied via `warningMessage` is propagated on missing
files or read errors.
