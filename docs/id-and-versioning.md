# Identity and Versioning

LCOD components use canonical identifiers that are independent from their physical source. The resolver binds those identifiers to Git/HTTP/file locations at install time.

## Component identity (`id`)

- Format: `lcod://<namespace>/<path>/<name>@<version>`
  - `<namespace>/<path>` may contain several segments separated by `/` (e.g. `impl/net`, `contract/ui/forms`).
  - Every segment is lowercase and may use `a-z`, digits, `_`, `.`, `-`.
  - `<version>` is a full Semantic Version (`MAJOR.MINOR.PATCH[-prerelease][+build]`).
- The fields `id`, `namespace`, `name`, and `version` in `lcp.toml` must agree with each other and with the canonical string.
- A published component ID is immutable. Republishing the same ID must yield identical sources/integrity.

## Dependency references (`implements`, `deps.requires`)

- Accept the canonical format above or a major-only shorthand:
  - `lcod://flow/foreach@1` → resolves to the latest compatible `1.x.y`.
  - `lcod://impl/net/fetch@1.2.0` → pins exactly `1.2.0`.
- Implementations (`kind = "function" | "workflow" | "ui"`) must declare `implements = <contract-id>`.
- Contracts may reference other contracts (e.g. to extend shared schemas) using the same syntax.

## Source resolution & lockfile

- `lcp.toml` never includes Git URLs or file paths.
- Resolver configuration supplies the mirrors/replacements.
- `lcp.lock` (planned for M2) records the exact source, commit hash, integrity, and chosen implementations for each dependency.

## Workspace-scoped components

- Packages can declare helper components with `scope = "workspace"`. They inherit the package version and remain private unless marked `public = true`.
- Within the same package, composes may reference these helpers using short IDs (e.g. `internal/lock-path`). During resolution the package ID prefixes the reference (`lcod://tooling/resolver/internal/lock-path@0.1.0`).
- A repository-level `workspace.lcp.toml` can define scope aliases and the list of packages so that renaming or forking updates happen in one place.

## Compatibility policy

- Follow SemVer for components and contracts.
- Breaking changes invalidate prior inputs/outputs → bump **MAJOR**.
- Additive schema changes and optional fields → bump **MINOR**.
- Bug fixes or documentation updates → bump **PATCH**.
- When exporting major-only shorthands in dependencies, keep backward compatibility within that MAJOR line.

## Example

```
schemaVersion = "1.0"
id = "lcod://impl/net/fetch@1.2.0"
name = "fetch"
namespace = "impl/net"
version = "1.2.0"
implements = "lcod://contract/net/http-client@1"

[deps]
requires = [
  "lcod://axiom/core/http@1",
  "lcod://helpers/retry@2.1.0"
]
```

The descriptor is versioned at `1.2.0`, fulfils the `http-client` contract for major `1`, depends on the HTTP axiom family, and pins an exact retry helper.
