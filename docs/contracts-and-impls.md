# Contracts and Implementations

- Contracts define stable interfaces (input/output schemas and semantics) with IDs like `lcod://contract/<domain>/<name>@<version>`.
- Implementations provide code for a contract with IDs like `lcod://impl/<domain>/<name>@<version>` and must declare `implements = "lcod://contract/..."` in `lcp.toml`.
- Compositions reference contracts; a resolver binds contracts to concrete implementations per project/org/user/environment.

## IDs and Kinds
- Contract: `kind = "contract"` (no code, only `tool.*` and docs)
- Implementation: `kind = "function" | "workflow" | "ui"` + `implements = <contract-id>`

## Binding
- A `bindings` config maps contract IDs to impl IDs. The lockfile records resolved bindings along with sources and integrity.
- Selection policy can prefer implementations by target/language/tags when multiple are available.

## Validation
- The kernel validates inputs/outputs against the contract schemas, regardless of the implementation details.

## Reserved Namespaces
- `lcod://contract/*`, `lcod://impl/*`, `lcod://axiom/*`, `lcod://flow/*`, `lcod://ui/*`
- `lcod://tooling/*` — shared runtime helpers implemented by kernels (e.g. `tooling/test_checker@1`, `tooling/script@1`, `tooling/registry/scope@1`)
