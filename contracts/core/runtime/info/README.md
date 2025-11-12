<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://contract/core/runtime/info@1.0.0

Expose basic runtime details such as cwd, home, temp directory, and platform.

## Notes

Expose the current process context (cwd, home directory, temp directory, platform).

## Input (`schema/info.in.json`)
- `includePlatform` (boolean, optional): include the `platform` field (default true).
- `includePid` (boolean, optional): include `pid` (default false).

## Output (`schema/info.out.json`)
- `cwd` (string): normalized absolute working directory.
- `homeDir` (string|null): home directory when resolvable.
- `tmpDir` (string): OS temporary directory.
- `platform` (string, optional): OS/platform identifier when requested.
- `pid` (integer|null, optional): process identifier when requested.
