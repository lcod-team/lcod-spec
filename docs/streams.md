# Streams and Chunked Processing

- Contracts may return AsyncIterables (streams) for large datasets or IO.
- `lcod://flow/foreach@1` can consume `in.stream` (AsyncIterable) or `in.list` (Array).
- Hints: `parallelism`, `prefetch`, `ordered`.
- Else-slot runs when there are zero iterations.
- Memory policy: prefer `outPolicy: "ephemeral"` on intermediate steps in large loops.

## Control flow helpers
- `lcod://flow/continue@1` skips to the next iteration by signalling `$signal === "continue"`.
- `lcod://flow/break@1` stops iteration early with `$signal === "break"`.
- Combine with `flow/if@1` inside the `body` slot to keep the composition declarative.
- Example: `examples/flow/foreach_ctrl_demo` shows skipping even numbers and breaking once a threshold is reached.
