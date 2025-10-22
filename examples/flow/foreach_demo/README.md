<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://flow/foreach_demo@0.1.0

Demo foreach composition collecting values with else-slot.

## Notes

Minimal demo to exercise `lcod://flow/foreach@1` with value collection
via `meta.collectPath`. Else-slot runs when the list is empty.

Notes
- Body echoes each item so `collectPath` can pick it up.
- Else-slot runs if the list is empty (results stays empty here).
- To run, register flow blocks (`foreach` and optionally `continue`/`break`) and a simple `impl/echo` in your runner.

Suggested `impl/echo` (pseudo):
`echo(ctx, { value }) => ({ val: value })`

Sample input
`{ "numbers": [1, 2, 3, 8, 9] }`

Expected output
`{ "results": [1, 2, 3, 8, 9] }`
