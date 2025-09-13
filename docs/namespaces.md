# Namespace Policy

Namespaces avoid collisions and convey ownership.

Reserved roots:
- `contract/*` — contracts (interfaces)
- `impl/*` — implementations
- `axiom/*` — SDK primitives
- `flow/*` — flow operators (if/foreach/parallel/try…)
- `ui/*` — UI components

Other namespaces:
- `core`, `demo` (maintained by the LCOD spec team)
- Organization namespaces: `org/*` (e.g., `org/acme`), or a company’s own prefix.
- Community namespaces: free-form, recommended to use GitHub org/user name.

Registration:
- For reserved namespaces, open an issue to propose new components.
- For organization/community, no central registration required; publish under your own registry.

Naming:
- Lowercase, `a-z0-9_-` only. Keep names short and descriptive.
