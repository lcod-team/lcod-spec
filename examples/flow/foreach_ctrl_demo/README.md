<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://flow/foreach_ctrl_demo@0.1.0

Foreach demo with continue/break and collectPath.

## Notes

Demonstrates `continue` and `break` in `lcod://flow/foreach@1`:
- Skip even numbers via `is_even` + `flow/continue@1`
- Stop at the first number greater than 7 via `gt` + `flow/break@1`
- Collects the echoed values via `collectPath: "$.val"`

Input: `{ "numbers": [1,2,3,8,9] }`
Output: `{ "results": [1,3] }`
