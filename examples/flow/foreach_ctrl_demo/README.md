# flow/foreach control demo

Demonstrates `continue` and `break` in `lcod://flow/foreach@1`:
- Skip even numbers via `is_even` + `flow/continue@1`
- Stop at the first number greater than 7 via `gt` + `flow/break@1`
- Collects the echoed values via `collectPath: "$.val"`

Input: `{ "numbers": [1,2,3,8,9] }`
Output: `{ "results": [1,3] }`

