# LCOD Workspaces — Best Practices

Workspaces let a repository host several LCOD packages that share helper components, tooling and documentation. They reduce duplication while keeping every published component self-contained. This note captures the conventions adopted in the resolver refactor so that other repositories can align on the same contract.

## Repository layout

```
repo-root/
├─ workspace.lcp.toml
├─ packages/
│  └─ resolver/
│     ├─ lcp.toml
│     ├─ compose.yaml
│     ├─ components/
│     │  └─ internal/
│     │     └─ load_descriptor/
│     │        ├─ lcp.toml
│     │        └─ compose.yaml
│     └─ schema/
└─ shared/…
```

- `workspace.lcp.toml` defines shared metadata, the package list, and scope aliases that can be reused across packages.
- Each package keeps its own `lcp.toml` descriptor. Workspace configuration lives under `[workspace]`, including a `components` array enumerating helper blocks.
- Helper components stay versioned with the package: by default the package `version` is inherited, so a single publish carries all workspace-scoped helpers.

See also `docs/structure.md` for the generic package layout.

## Scope aliases and component IDs

Workspaces expose private helpers through short identifiers (e.g. `internal/load-config`). Canonical IDs are reconstructed at runtime by combining:

1. the package base path (extracted from `id`, `namespace` or `name`);
2. the alias target defined in `[workspace.scopeAliases]`;
3. the remaining path segments from the short identifier;
4. the package version.

Example from `packages/resolver/lcp.toml`:

```toml
[workspace.scopeAliases]
internal = "internal"

[[workspace.components]]
id = "internal/load-config"
path = "components/internal/load_config"
```

Resolving `internal/load-config` yields `lcod://tooling/resolver/internal/load-config@0.1.0`. The helper’s own `lcp.toml` can continue to declare the canonical ID explicitly; kernels will register both the canonical ID and any aliases that already exist.

Guidelines:

- Stick to lower-case aliases and keep them repository-specific (`internal`, `tooling`, `ops`…).
- Avoid reusing global namespaces for workspace-only helpers; the alias keeps them private.
- When migrating an existing repo, leave the previous canonical `id` in the helper manifest. The kernels automatically register it as an alias so downstream projects remain compatible.

## Compose authoring

Inside a workspace, composes should always reference helpers through the short alias:

```yaml
compose:
  - call: internal/load-descriptor
    in:
      projectPath: $.projectPath
```

This keeps composes portable. Forks or namespace changes only require updating the package manifest instead of touching every compose. For published components that need to reference helpers from a different package, stick with fully qualified `lcod://…` IDs.

## Kernel and resolver integration

Both kernels discover workspaces automatically:

- **Node** (`lcod-kernel-js/src/tooling/resolver-helpers.js`) looks up `workspace.lcp.toml`, reads each package manifest, and canonicalises composes before execution so short IDs are valid everywhere.
- **Rust** (`lcod-kernel-rs/src/tooling/mod.rs`) mirrors the same behaviour: it derives the package context, expands aliases, preserves legacy IDs as aliases, and canonicalises nested `call`/`composeRef` statements.

The discovery order is:

1. `LCOD_RESOLVER_COMPONENTS_PATH` (legacy path with plain components).
2. `LCOD_RESOLVER_PATH` (resolver repository root).
3. Sibling checkouts (`../lcod-resolver`; legacy `../lcod-spec/tooling/resolver` kept for pre-workspace trees) to support mono-checkouts.

Tooling that loads composes (tests, CLIs) should mirror this canonicalisation step. See `lcod-kernel-js/test/tooling.resolver.test.js` and `lcod-kernel-rs/tests/resolver.rs` for reference implementations.

## Migration checklist

1. Add `workspace.lcp.toml` at the repository root with the package list and default alias map.
2. Move each published package under `packages/<name>/` and update its `lcp.toml` to declare workspace components.
3. Update composes to reference helpers via short IDs.
4. Ensure CI points tests to the new workspace structure (`npm test`, `cargo test`, etc.).
5. Keep an eye on downstream consumers; once they run a workspace-aware kernel they can drop legacy resolver paths.

Following these steps makes it easier to share helpers across packages, keeps IDs stable, and lets kernels operate without repository-specific wiring.
