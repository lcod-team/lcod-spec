# Identity and Versioning

This spec separates identity from the physical source location.

- Canonical ID: `lcod://<namespace>/<name>@<version>`
  - `<namespace>` and `<name>` are lowercase with `a-z0-9_-`.
  - `<version>` follows SemVer (`MAJOR.MINOR.PATCH[-prerelease][+build]`).
- The canonical ID appears in `lcp.toml` (`id`) and in dependencies (`deps.requires`).
- Source URIs (git/http/file) are resolved by the resolver and frozen in `lcp.lock`; they do not appear in `lcp.toml`.

Compatibility policy:
- Follow SemVer. Backward-incompatible changes bump MAJOR.
- Validation schemas must evolve compatibly within a MAJOR line.

