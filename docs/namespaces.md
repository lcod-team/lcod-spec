# Namespace Policy

Namespaces avoid collisions and convey ownership.

## Reserved roots
- `contract/*` — contracts (interfaces)
- `impl/*` — implementations
- `axiom/*` — SDK primitives
- `flow/*` — flow operators (if/foreach/parallel/try…)
- `ui/*` — UI components

Any additional segments may follow the reserved root (e.g. `impl/net`, `contract/ui/forms`).

## Organisation and community namespaces
- `core`, `demo` are maintained by the LCOD spec team.
- Companies can claim `org/<slug>` (e.g. `org/acme`); use your DNS or GitHub org name for consistency.
- Community packages may use `<user>/<project>` or any lowercase hierarchy.

## Naming rules
- Lowercase only. Allowed characters per segment: `a-z`, `0-9`, `_`, `.`, `-`.
- Segments are separated by `/` to form hierarchies (`impl/net/http_get`).
- Keep identifiers short yet descriptive. Avoid abbreviations that require tribal knowledge.

## Registration
- Reserved namespaces require a proposal (issue or PR) with justification and compatibility plan.
- Community namespaces do not require central approval—publish under your own registry, but document stewardship.

## Tips
- Mirror your source control structure. If the package lives at `github.com/acme/weather`, pick `org/acme/weather`.
- Do not overload a namespace with unrelated domains; split into meaningful sub-paths.
