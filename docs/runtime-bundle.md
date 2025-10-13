# LCOD Runtime Bundle

The runtime bundle packages the helper components and fixtures that kernels and
CI pipelines need to execute LCOD compositions without cloning the `lcod-spec`
and `lcod-resolver` repositories. It contains:

- `tooling/` — resolver/registry/compose helpers (`lcp.toml`, `compose.yaml`,
  schemas, tests).
- `tests/spec/` — shared fixtures executed by the kernels.
- `tests/conformance/` — the cross-runtime manifest used for parity checks.
- `schemas/` — JSON Schemas referenced by the helper components.
- `resolver/` — workspace snapshot from `lcod-resolver` (`packages/resolver/**`,
  `workspace.lcp.toml`) ready to load in kernels.
- `metadata/lcod-resolver-runtime.json` — snapshot of the `lcod-resolver`
  workspace components that are included in the bundle.
- `manifest.json` — bundle metadata (spec version, commit, resolver commit).

## Building the bundle locally

Prerequisites:

- Node.js ≥ 18
- Local clones of `lcod-spec` and `lcod-resolver`
- The resolver snapshot (`runtime/lcod-resolver-runtime.json`) generated in the
  resolver repository (see below)

```bash
cd lcod-spec
node scripts/package-runtime.mjs
# artefact: dist/runtime/lcod-runtime-<label>.tar.gz
```

Options:

```
--output <dir>     Output directory (default: dist/runtime)
--label <name>     Folder/archive label (default: v<package.version> or dev-<sha>)
--resolver <path>  Path to the lcod-resolver checkout (default: sibling repo)
--keep             Keep the staging directory for inspection
--dry-run          Run validation without emitting files
```

## Generating the resolver snapshot

In `lcod-resolver`, run:

```bash
node scripts/export-runtime.mjs
# writes runtime/lcod-resolver-runtime.json
```

This JSON document lists the resolver components, their versions and entry
points. The spec bundle copies the file into `metadata/` so kernels can display
runtime provenance and verify compatibility.

## Consuming the bundle

The bundle is extracted into a shared location (for example
`$HOME/.lcod/runtime/<version>`). Kernels look up helper components relative to
the `LCOD_HOME` environment variable:

```
LCOD_HOME=/path/to/lcod-runtime-<label>
├── manifest.json
├── metadata/
├── resolver/
├── tooling/
├── tests/
└── schemas/
```

If `LCOD_HOME` is not set, kernels fall back to developer-friendly discovery
(`SPEC_REPO_PATH`, `RESOLVER_REPO_PATH`), but the bundle is the supported path
for production automation.

## Verification

The packaging script ensures that critical files are present before creating
the archive. Additional verification composes/tests can be added under
`tests/spec/runtime_bundle/` and executed by kernels to confirm that the bundle
matches the expected schema and contains up-to-date helper components.

> **Automation** – The `Publish Runtime Bundle` GitHub Action in `lcod-spec`
> runs on every release (and on demand) to execute this script, publish the
> `tar.gz` archive, and attach a SHA-256 checksum to the release page.
