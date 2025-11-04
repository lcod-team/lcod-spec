# LCOD Resolver Specification

This document captures the conventions shared by LCOD runtimes and tools when
resolving component packages. It describes the responsibilities of the resolver
versus the kernel, the default command-line behaviour, and how caches and
lockfiles are discovered.

## Responsibilities

- **Resolver (`lcod-resolver`)**
  - Consume a descriptor (`compose.yaml` + `lcp.toml`) and optional resolver
    configuration.
  - Merge catalogue pointers declared in the JSONL manifest lists (default
    `lcod.sources.jsonl` chain; see
    [`docs/resolver/manifest-lists.md`](manifest-lists.md)).
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

## Shared Components

Reusable building blocks published in `lcod-resolver/packages/resolver` keep resolver
composes small and consistent. A resolver package exposes them as **workspace
components** so they share the package version and can be referenced with short
IDs:

- `internal/load-descriptor` — locate and parse `lcp.toml` from a project directory.
- `internal/load-config` — fetch `resolve.config.json`, apply defaults, emit warnings.
- `internal/load-sources` — parse manifest lists (`lcod.sources.jsonl` or legacy `sources.json`), download catalogue pointers and
  materialise inline registry sources (see `tests/spec/resolver_sources` fixture).
- `internal/lock-path` — derive the destination of `lcp.lock` from project/output hints.
- `internal/build-lock` — assemble the final lock payload and its TOML representation.

Both the specification example (`examples/tooling/resolver`) and the production
resolver compose import these helpers, demonstrating cross-repo reuse of
standard components. The canonical implementations now live in
`lcod-spec/tooling` (with matching IDs such as `lcod://tooling/value/default_object@0.1.0`
or `lcod://core/object/merge@0.1.0`), so kernels can bootstrap the resolver
stdlib straight from the spec checkout or packaged runtime bundle without
cloning `lcod-components`. In standalone packages, the helpers live next to the
primary compose with `scope = "workspace"` in `packages/resolver/lcp.toml`, and
the repository root provides a `workspace.lcp.toml` describing the package list
and default scope aliases. The resolver expands relative IDs (e.g.
`internal/load-config`) to the package prefix
(`lcod://tooling/resolver/internal/load-config@0.1.0`) before producing the
lockfile. Kernels stay minimal: they load workspace-local components first
(lockfile/cache), only falling back to the shared registry or resolver when
nothing is found.

## Registry scopes and lazy resolution

- **Nested scopes** — every execution wraps helper registration in a child registry scope (via `tooling/registry/scope@1`). Helpers declared inside the scope cannot override components owned by the parent catalogue, while hot reload stays local to the execution.
- **Workspace scope** — components declared with `scope = "workspace"` inherit
  the package version and are registered automatically when the package loads.
  Renaming or forking a package only requires updating the manifest; relative
  identifiers in composes continue to resolve.
- **Lazy resolution** — when a `call` references an ID, the kernel checks
  already-registered components in the current scope, then the associated
  lockfile/cache. Only if the ID is still missing does it invoke the resolver.
- **Visibility** — a component can flag helpers as `public` (catalogue) or
  `internal` (local-only). Internal helpers stay confined to their scoped registry; only public components get promoted to shared registries.
- **Resolver helpers** — kernels look for helper components in `LCOD_RESOLVER_COMPONENTS_PATH`
  or `LCOD_RESOLVER_PATH` before falling back to packaged catalogues. Set these env vars when
  running the resolver in-tree to avoid hitting the global registry. Once `tooling/registry/scope@1`
  is available, the resolver compose will wrap helper registration in a scoped registry to keep
  internal components private.

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
  - `--sources <path>` explicit manifest list (`lcod.sources.jsonl` by default,
    falling back to the official LCOD registry manifest).

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
