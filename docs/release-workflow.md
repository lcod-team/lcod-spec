# Release Workflow

This document captures the end-to-end workflow used to publish LCOD components and registry updates. It aligns the spec, the resolver, and the kernels so a release follows the same checklist regardless of the repository involved.

## 1. Versioning Strategy

LCOD packages follow Semantic Versioning (`MAJOR.MINOR.PATCH`).

- **MAJOR** increments introduce breaking changes for consumers (schema/contract changes, incompatible compose semantics).
- **MINOR** increments add backwards-compatible features or new helper components.
- **PATCH** increments deliver bug fixes or documentation-only tweaks that do not affect compose behaviour.

Pre-release tags (`-alpha.N`, `-beta.N`, `-rc.N`) are allowed while a feature is stabilized. Pre-release manifests are published to the registry but cannot be promoted to “latest” in compatibility tables until they shed the suffix.

Every package (spec helper, resolver component, registry helper) carries the same version as the surrounding workspace package to keep transitive dependencies predictable.

## 2. Compatibility Matrix

Maintainers keep a small matrix that states which resolver/kernels support a given helper version. The matrix is stored in the release notes or README and must be updated when a new helper or contract is introduced.

| Helper | Resolver | Node kernel | Rust kernel |
| ------ | -------- | ----------- | ----------- |
| `tooling/resolver/context@0.1.x` | `lcod-resolver >= 0.6` | `lcod-kernel-js >= 0.5` | `lcod-kernel-rs >= 0.4` |
| `tooling/registry/index@0.1.x`  | `lcod-resolver >= 0.6` | `lcod-kernel-js >= 0.5` | `lcod-kernel-rs >= 0.4` |

When a helper bumps its MAJOR version, a new row is added and the documentation must call out the migration steps.

## 3. Release Checklist

1. **Freeze the change set**
   - Merge feature branches; ensure `main` is green (`npm run validate`, `npm run test:spec`, kernel `npm test`, resolver/kernels `cargo test`).
   - Update changelog or release notes if available.
2. **Bump versions**
   - Update `version` in workspace `lcp.toml` and in every helper package touched by the release.
   - Regenerate lockfiles if applicable.
3. **Run validation**
   - `npm run validate` (spec) to ensure schema consistency.
   - `npm run test:spec` (node kernel harness) with the latest helpers.
   - `cargo test` in resolver/kernels when relevant.
4. **Prepare registry artefacts**
   - Generate manifest updates (`packages.jsonl`, `manifest.json`, `versions.json`) using the resolver tooling.
   - Compute SHA-256 hashes for each artefact and embed them in the manifest.
5. **Open the release PR**
   - Include the manifest diff, changelog snippet, and compatibility matrix update.
   - Reference the roadmap ticket (e.g. M5-02) and link to the validation logs.
6. **Tag & publish**
   - Once the PR is merged, tag the commit (`vX.Y.Z`) in each repo.
   - Push tags and publish the registry PR.
   - The `Publish Runtime Bundle` workflow runs on release publication and attaches
     `lcod-runtime-<tag>.tar.gz` + checksum to the GitHub Release. If a release is
     prepared manually, trigger the workflow via *Run workflow* (provide the same tag)
     to regenerate the archive.

## 4. Registry Publication Flow

Registry updates are Git-based:

1. Create a branch in `lcod-registry` with the new manifests/JSONL entries.
2. Run the registry validation script (`npm run validate:registry` once available) to ensure manifests are well-formed.
3. Open a PR referencing the release checklist and attach SHA-256 hashes.
4. After merge, verify that the static hosting (GitHub Pages or equivalent) reflects the new files.

Consumers point to the Git URL or HTTP mirror; no custom API is necessary.

## 5. Consumer Expectations

Resolvers and kernels read the registry artefacts as follows:

- The resolver pulls latest manifests according to the mirror/replace rules inside `resolve.config.json`.
- Kernels load helper composes lazily (see `src/tooling/registry-components.js` for Node, `src/tooling/mod.rs` for Rust). If a helper is missing, the compatibility matrix highlights which runtime release is required.
- Caches are stable by design: once a manifest is published, in-place edits are forbidden. New content must use a new version directory to keep hashes immutable.

## 6. Maintainer Checklist (TL;DR)

- [ ] All tests green across spec/resolver/kernels.
- [ ] Version bump committed in the relevant packages.
- [ ] Registry manifests regenerated with hashes.
- [ ] Compatibility matrix updated.
- [ ] Release PR merged and tags pushed.
- [ ] Registry PR merged and static hosting refreshed.
