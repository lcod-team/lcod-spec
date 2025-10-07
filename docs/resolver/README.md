# LCOD Resolver Specification

This document captures the conventions shared by LCOD runtimes and tools when
resolving component packages. It describes the responsibilities of the resolver
versus the kernel, the default command-line behaviour, and how caches and
lockfiles are discovered.

## Responsibilities

- **Resolver (`lcod-resolver`)**
  - Consume a descriptor (`compose.yaml` + `lcp.toml`) and optional resolver
    configuration.
  - Produce an `lcp.lock` with fully resolved component sources and integrity
    metadata.
  - Materialise component artefacts into a cache directory (filesystem, Git,
    HTTP downloads, etc.).
- **Kernel (`lcod-rs`, `lcod-js`, …)**
  - Execute a compose using an existing `lcp.lock` and cached artefacts.
  - Optionally invoke the resolver when a compose must be executed but no
    lockfile is available yet (“auto resolve” mode).

The two components remain separable: CI/CD pipelines can run the resolver
explicitly, while end users can trigger it implicitly via the kernel CLI.

## CLI Conventions

### Resolver

`lcod-resolver install <descriptor-or-path> [options]`

- When run inside a project containing `lcp.toml`, the default output is:
  - `./lcp.lock`
  - component artefacts in `./.lcod/cache`
- When given an ID or URL, the resolver writes into the user cache
  (`~/.cache/lcod`) and stores the lockfile under
  `~/.cache/lcod/locks/<descriptor-hash>.lock`.
- Options (all optional):
  - `--lock <path>` override lockfile destination.
  - `--cache <dir>` override cache root.
  - `--config <path>` explicit resolver configuration file (default:
    `resolve.config.json` at project root, then `~/.config/lcod/resolver.json`).

### Kernel

`lcod-rs run [options] <target> [<input-json>]`

- `<target>` may be:
  - Path to an `lcp.lock`.
  - Path to a directory containing `lcp.lock`.
  - Descriptor ID/URL (the kernel will look up or generate a lock).
- Default resolution behaviour:
  1. Use `--lock` if provided.
  2. Look for `./lcp.lock`.
  3. If `<target>` is an ID/URL, search `~/.cache/lcod/locks/<hash>.lock`.
  4. Otherwise invoke `lcod-resolver install <target>` (unless `--no-resolve`),
     then retry steps 1–3.
- Cache lookup priority:
  1. `--cache` if provided.
  2. `./.lcod/cache` when present.
  3. Fallback to `~/.cache/lcod/packages`.
- Additional flags:
  - `--cache <dir>` override cache root.
  - `--resolver-config <path>` forward a config file to the resolver.
  - `--no-resolve` fail if no lockfile is available (offline mode).

### Example End-to-End Flow

```bash
# Prepare a project (explicit two-step)
lcod-resolver install ./current_weather --lock ./lcp.lock --cache ./.lcod/cache
lcod-rs run --lock ./lcp.lock --cache ./.lcod/cache '{"city":"Paris"}'

# Direct execution from an URL/ID (auto resolve in user cache)
lcod-rs run https://repository.com/lcod/current_weather '{"city":"Paris"}'
```

In the second example, the kernel:
1. Downloads the descriptor.
2. Checks `~/.cache/lcod/locks/<hash>.lock`.
3. If missing, runs the resolver on the descriptor, populating
   `~/.cache/lcod/packages`.
4. Executes the compose using the newly created lock.

## Cache Layout

Default cache root (`~/.cache/lcod` on Unix-like systems):

```
~/.cache/lcod/
  packages/
    <package-hash>/
      snapshot/        # resolved component files
      metadata.json
  locks/
    <descriptor-hash>.lock
  registry/            # optional registry manifests
```

A project can maintain its own cache under `./.lcod/cache`, which mirrors the
same structure. Users can override cache roots through the CLI or environment
variables (e.g. `LCOD_CACHE_DIR`).

## Environment Variables

- `LCOD_CACHE_DIR` — overrides the root cache directory used by both resolver
  and kernel.
- `LCOD_RESOLVER_CONFIG` — path to a global resolver configuration file.
- `LCOD_NO_AUTO_RESOLVE` — if set, kernels run in explicit mode and fail when a
  lockfile is missing.

## Distribution

- Binary releases of `lcod-rs` SHOULD bundle the resolver compose and invoke it
  internally when auto-resolve is enabled.
- `lcod-resolver` MUST remain callable as a standalone binary so that pipelines
  can generate locks offline.
- Packages SHOULD include `lcp.toml`, `compose.yaml`, `schema/` and optional
  samples (e.g. `state.example.json`) so that they can be resolved independently
  of a specific runtime.

These conventions are the source of truth for resolver behaviour. Individual
repositories (e.g. `lcod-resolver`, `lcod-kernel-rs`) can reference this document
for implementation details and CLI help.
