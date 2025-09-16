# flow/foreach demo

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
