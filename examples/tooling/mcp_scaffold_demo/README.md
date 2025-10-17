# MCP scaffold demo

This example shows how to orchestrate the new MCP authoring components entirely via LCOD:

1. `tooling/mcp/session/open@0.1.0` creates a workspace under `./.lcod/mcp-demo/workspaces`.
2. `tooling/mcp/component/scaffold@0.1.0` generates `lcp.toml`, `compose.yaml`, and `docs/README.md`.
3. The final step returns the session details so downstream automation can enrich provenance or continue authoring.

Run with `lcod-run`:

```bash
~/.bin/lcod-run \
  --compose examples/tooling/mcp_scaffold_demo/compose.yaml \
  --input examples/tooling/mcp_scaffold_demo/state.json
```

> The example assumes you have the `lcod-components` repository checked out next to `lcod-spec`. Adjust `componentsRoot` in `state.json` if it lives elsewhere.

After execution, inspect the workspace folder to review the generated files. Subsequent MCP operations (slots, implementations, tests) can build on this scaffold.
