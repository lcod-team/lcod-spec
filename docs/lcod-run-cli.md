# `lcod-run` — Autonomous Runtime CLI

## 1. Goals

- Execute an LCOD compose from a **single command**: `lcod-run <compose> [options]`.
- **Resolve, download, cache, and run** components end-to-end without cloning repositories manually.
- Ship as a **standalone binary** (Rust) embedding the runtime bundle (spec + resolver helpers).
- Offer a DX similar to `npx`: runs in an empty directory, caches artefacts for next runs, supports both local and global cache modes.
- Guarantee **compatible toolchain versions** by bundling spec/resolver snapshots alongside the kernel.

## 2. Scope & Non-Goals (MVP)

### In Scope

- Accept compose paths or URLs (HTTP/S).
- Optional resolution step: produce a local lockfile when missing.
- Execute compose with JSON input (file or stdin).
- Manage caches (`.lcod/cache` local by default, `~/.lcod/cache` via `--global-cache`).
- Embed helper bundle in the binary and unpack it to a versioned runtime directory.
- Provide minimal logging and JSON output.

### Out of Scope (v1)

- Multi-version manager (`lcodenv`).
- Registry authentication/mirrors.
- Bundle update checks / auto-upgrade.
- Advanced UX (progress bars, plugins).
- Cross-runtime comparison (Node vs Rust) — optional follow-up.

## 3. High-Level Architecture

```
         +----------------------------+
         |         lcod-run           |
         | (Rust CLI + embedded data) |
         +-------------+--------------+
                       |
             [Runtime Bootstrap]
         - Extract embedded bundle to ~/.lcod/runtime/<bundle-hash>
         - Set LCOD_HOME to that path
                       |
             [Command Execution]
         1. Parse CLI args
         2. Fetch compose (local path or download)
         3. Determine cache dir (.lcod/cache or global)
         4. If --resolve or lock missing:
               - invoke tooling/resolver helpers via embedded bundle
               - write lcp.lock
         5. Run compose via kernel (Rust implementation)
         6. Output JSON result (stdout), exit code 0/1
```

### Embedded Bundle

- Bundled at build time (`include_bytes!`) to guarantee matching versions.
- Contains `tooling/`, `resolver/`, `tests/spec`, `schemas`, `manifest.json`.
- Extracted at runtime to `$HOME/.lcod/runtime/<bundle-id>` (bundle-id derived from SHA256).
- `LCOD_HOME` is set dynamically so helper registration works.

## 4. CLI Reference (MVP)

```
lcod-run --compose <path-or-url> [options]

Options:
  --compose, -c <path-or-url>   Path or HTTP(S) URL to compose file (YAML/JSON).
  --input, -i <json-path|->     JSON input file; "-" reads from stdin (default: {}).
  --resolve                     Force resolution even if lcp.lock is present.
  --lock <path>                 Output path for generated lock (default: <compose-dir>/lcp.lock).
  --cache-dir <path>            Explicit cache directory (overrides local/global defaults).
  --global-cache, -g            Use ~/.lcod/cache instead of ./.lcod/cache.
  --log-level <level>           Minimum kernel log level (trace|debug|info|warn|error|fatal).
                                Defaults to `fatal`; can also be provided via LCOD_LOG_LEVEL.
  --timeout <duration>          Abort execution after the given duration (e.g. 30s, 2m).
  --version                     Print lcod-run version.
  --help                        Usage summary.
```

### Log level control

- `lcod-run` reads `--log-level` first; if omitted it falls back to `LCOD_LOG_LEVEL` and finally to `fatal`.
- The selected threshold is propagated to the kernels and refreshed on the fly for every log call. Updating `LCOD_LOG_LEVEL` mid-run (or using multiple `lcod-run` invocations with different flags) immediately changes the emitted diagnostics without restarting the binary.
- Kernel diagnostics (`component = "kernel"`) remain muted unless the threshold allows them; application logs dispatched through the contract continue to flow even when no binding is installed.

### Cancellation

- Pressing `Ctrl+C` (SIGINT) triggers a cooperative cancellation: the current step finishes, resources are cleaned up, and the CLI exits with status `130`.
- `--timeout <duration>` schedules the same cancellation automatically after the provided duration (accepts raw milliseconds or suffixes such as `30s`, `2m`, `1h`).
- Cancellation errors surface as `Execution cancelled` without additional stack traces.

### Planned extensions (post-MVP)

- `--sources <path-or-url>` to override default resolver sources.
- `--lock-only` to resolve without executing.
- `--runner node|rust` (if we add cross-runtime support later).
- `lcod-run install` / `lcod-run upgrade` helper commands.

## 5. Execution Flow (Detailed)

1. **Bootstrap bundle**
   - On first run, compute SHA256 of embedded bundle, extract to `~/.lcod/runtime/<sha>`.
   - Keep manifest with spec/resolver commits and CLI version.
   - Clean up older bundle versions during future `lcod-run cleanup`.
2. **Compose acquisition**
   - If `--compose` is local, resolve relative to CWD.
   - If HTTP/HTTPS: download to `~/.lcod/tmp/<hash>/compose.yaml`.
   - For Git raw URLs, rely on HTTP layer (e.g. raw.githubusercontent.com) initially.
3. **State preparation**
   - Determine working directory from compose path.
   - Choose cache directory:
     - default: `<compose-dir>/.lcod/cache`;
     - `--global-cache`: `~/.lcod/cache`;
     - `--cache-dir`: explicit path.
   - Ensure directories exist.
4. **Resolution**
   - Check for existing `lcp.lock` (path from `--lock` or default).
   - If absent or `--resolve`:
     - Load default embedded `sources.json` pointing to the official registry.
     - Run `tooling/resolver/internal/load-sources@0.1.0`.
     - Run `internal/resolve_dependencies` to produce lock.
     - Write `lcp.lock`.
5. **Execution**
   - Register runtime components from embedded bundle.
   - Load input JSON (file or stdin).
   - Execute compose; collect `report` & `result`.
   - Print JSON to stdout.
6. **Cleanup**
   - Stop hosts if any (serve mode is out-of-scope for MVP).
   - Remove temporary download dir.
   - Exit with code 0 on success, 1 on failure.

## 6. Caching Strategy

- Resolver cache stored under `<cache>/catalogues/*`.
- Temp workspace per run inside cache or `~/.lcod/tmp`.
- Lockfiles written explicitly, not hidden inside cache.
- Future helpers (`lcod-run cache ls|clear`) to manage content.

## 7. Packaging & Distribution

- GitHub Actions build static binaries for macOS, Linux, Windows.
- Each release publishes:
  - `lcod-run-<os>-<arch>.tar.gz` (binary + README).
  - SHA-256 checksum.
  - Embedded bundle manifest.
- Install script (curl | bash) copies binary into `/usr/local/bin` or `~/.local/bin`.

## 8. Versioning

- CLI follows semver (`lcod-run v0.x` until GA).
- Embedded bundle metadata exposes `specCommit`, `resolverCommit`, `bundleLabel`.
- `lcod-run --version` prints CLI + bundle info.
- Future support for `LCOD_RUNTIME_VERSION` env var to pin a specific bundle.

## 9. Security Considerations

- Embedded bundle is trusted (built alongside CLI) but we still validate checksums before extraction.
- Downloaded compose URLs limited to HTTP(S); later we can add `--allow-unsafe` for file://.
- Warn when executing unlocked composes from remote sources.
- Plan for signature verification once registry supports signed manifests.

## 10. Roadmap (Iterations)

1. **Iteration 1 (MVP)**
   - Embedded bundle, local/global cache, compose download, lock generation, execution.
   - Basic logging + error reporting.
2. **Iteration 2**
   - `--sources`, `--lock-only`, improved logging, CLI config schema.
3. **Iteration 3**
   - Installer script, Windows support, cache management commands.
4. **Iteration 4**
   - Version manager hooks (`lcod-run use <version>`), multi-kernel support.

## 11. Embedding the Runtime in the CLI

During development the CLI can embed a specific runtime bundle by setting `LCOD_EMBED_RUNTIME=/path/to/lcod-runtime-<label>.tar.gz` before running `cargo build`. The build script copies the archive into the binary so `lcod-run` can bootstrap `LCOD_HOME` without cloning `lcod-spec`. When the variable is unset, the binary falls back to the legacy discovery (`SPEC_REPO_PATH`, neighbours, etc.).

```
LCOD_EMBED_RUNTIME=../dist/runtime/lcod-runtime-dev.tar.gz cargo build --release
```

The GitHub release pipeline will set this variable to ensure the published binaries remain self-contained.
