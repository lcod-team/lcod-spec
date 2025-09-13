# Streams and Chunked Processing

- Contracts may return AsyncIterables (streams) for large datasets or IO.
- `lcod://flow/foreach@1` can consume `in.stream` (AsyncIterable) or `in.list` (Array).
- Hints: `parallelism`, `prefetch`, `ordered`.
- Else-slot runs when there are zero iterations.
- Memory policy: prefer `outPolicy: "ephemeral"` on intermediate steps in large loops.

