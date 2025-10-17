# MCP-Assisted Authoring

This document defines the requirements for the MCP backend that will let assistants (or IDE integrations) create and maintain LCOD components without hand-editing the source files. The goal is to expose high-level operations so an agent manipulates abstract concepts (components, slots, implementations, schemas) while the MCP service serialises everything back to `lcp.toml`, `compose.yaml`, and supporting assets. The entire workflow must execute through LCOD composes and be reproducible with `lcod-run`.

## 1. Objectives

- Provide a structured API that hides file formats from assistants while guaranteeing valid LCOD artefacts.
- Reuse LCOD runtime helpers (`lcod-run`, resolver pipeline, validators) for every operation so the catalogue stays coherent.
- Capture provenance (who generated a change, which prompts) so human reviewers can audit MCP-produced components.
- Keep the design portable: any kernel or language binding can talk to the MCP contract.

## 2. Session model

The MCP server exposes **workspace sessions**. Each session maps to a working tree (git checkout or ephemeral workspace) that contains the component under construction. Sessions may:

- start from scratch (new component),
- clone an existing component for extension,
- load an existing catalogue entry for edits.

The server maintains a manifest of open sessions and their provenance metadata (agent ID, user, creation time, parent component).

All write operations must go through a transaction wrapper:

1. Apply mutations in memory (using LCOD composes).
2. Validate the resulting artefacts.
3. Persist to disk only if validation succeeds.

## 3. Operations

| Operation | Purpose |
| --------- | ------- |
| `component.create` | Create a component scaffold with namespace, name, version, summary, palette metadata. |
| `component.checkout` | Load an existing component into a session (read/write). |
| `component.describe` | Return the current abstract graph (inputs, outputs, slots, implementations, docs). |
| `slot.add` / `slot.update` / `slot.remove` | Manipulate slots, specifying signature and documentation. |
| `io.set` | Define inputs / outputs schemas (inline JSON schema or references). |
| `implementation.add` | Attach a new implementation (type `compose`, `script`, `native`), providing source text or references. |
| `implementation.update` | Modify existing implementation metadata or source. |
| `docs.set` | Update README/long description, examples, palette hints, icons. |
| `test.add` / `test.run` | Create JSON test fixtures and execute them with `lcod-run`. |
| `validation.run` | Run the LCOD validators (schema + compose normaliser) and return diagnostics. |
| `publish.prepare` | Freeze the session, produce a diff summary, and emit PR metadata (base branch, reviewers, changelog). |
| `namespace.reserve` | Optional: ensure the registry grants rights before authoring a new namespace/component. |

Each operation receives/returns structured JSON. The server translates requests into LCOD compose calls.

## 4. Implementation building blocks

The MCP backend is itself an LCOD project. Key components to expose (living in `lcod-components` and executed via `lcod-run`):

- `tooling/mcp/session/open@1`: create a workspace, clone/fetch component if needed.
- `tooling/mcp/component/scaffold@1`: initialise `lcp.toml`, default compose, README.
- `tooling/mcp/component/update_metadata@1`: mutate summary, palette, tags, owners.
- `tooling/mcp/slot/manage@1`: add/update/remove slots from the compose.
- `tooling/mcp/schema/set@1`: write JSON schema files and register references.
- `tooling/mcp/implementation/set@1`: manage compose/script/native implementations and detect duplicates.
- `tooling/mcp/tests/run@1`: execute test fixtures through `lcod-run` and collect results.
- `tooling/mcp/validate@1`: run validators (schema + compose normaliser) and return diagnostics.
- `tooling/mcp/publish/prepare@1`: generate changelog, PR body, provenance document.

These components wrap lower-level helpers already available in the spec: compose normaliser, registry helpers, resolver pipelines, runtime bundle checkers.

## 5. Request / response format

```
{
  "version": "1.0",
  "operation": "component.create",
  "sessionId": "sess-123",
  "payload": {
    "namespace": "lcod/demo",
    "name": "weather_card",
    "version": "0.1.0",
    "summary": "Fetches and renders weather info for a city"
  }
}
```

Responses include:

```
{
  "status": "ok",
  "operation": "component.create",
  "sessionId": "sess-123",
  "result": {
    "componentId": "lcod://lcod/demo/weather_card@0.1.0",
    "workspacePath": "/tmp/mcp-sess-123",
    "files": ["lcp.toml", "compose.yaml", "docs/README.md"]
  }
}
```

Errors must surface validation diagnostics (line/column, file) and suggest follow-up operations.

## 6. Validation & provenance

- Every mutating operation ends with `tooling/mcp/validate@1`. It collects schema issues, compose errors, style hints.
- Provenance files (`.lcod/provenance.json`) summarise MCP actions, prompts, assistants. They are committed alongside the component.
- The MCP backend should provide a `publish.preview` operation returning:
  - diff summary,
  - list of generated artefacts,
  - provenance snapshot,
  - recommended reviewers (fetched from registry namespace config).

## 7. Integration with `lcod-run`

- The backend runs all LCOD composes through `lcod-run --resolver` to guarantee consistent resolution and caching.
- Tests use the shared runtime bundle; no external tooling should be required besides `lcod-run`.
- The MCP server exposes configuration so advanced users can point to alternative registry sources (e.g. internal mirrors) – the same JSON format defined in `docs/registry.md`.

## 8. Security considerations

- Sessions run in isolated workspaces; no untrusted code is executed outside of the LCOD sandbox.
- Namespace reservation requires registry authorisation. The MCP server must call the registry API (or compose) before allowing publication.
- Rate limiting and audit logs must be enforced to avoid automated spam.

## 9. Roadmap alignment

The work items above map to the new milestone **M7 — MCP-assisted authoring** in the spec roadmap, plus companion milestones in `lcod-resolver` and `lcod-registry`. Delivering the MCP backend requires:

1. Implementing the components listed in §4 inside `lcod-components`.
2. Providing end-to-end examples/tests executed via `lcod-run`.
3. Shipping a reference automation (CLI or agent) that triggers these MCP operations.

Future iterations may extend the MCP contract with UI/IDE-oriented helpers (palette rendering hints, autocomplete feeds) once the core authoring flow is stable.
