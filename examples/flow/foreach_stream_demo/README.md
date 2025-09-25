# flow/foreach stream demo

Demonstrates iterating over a stream input with `lcod://flow/foreach@1`:
- Items are read from the `stream` binding rather than a materialised array.
- Each chunk is echoed back using `collectPath: "$.val"`.
- When the stream is empty the `else` slot produces an `"empty"` marker.

Expected behaviour (with an initial state `{ "numbers": [1,2,3] }`):

```json
{ "results": [1,2,3] }
```

With an empty stream `{ "numbers": [] }` the output becomes:

```json
{ "results": ["empty"] }
```

Implementations are free to back the stream handle with a temporary file or an
in-memory queue, but the compose contract only observes the `stream` handle and
chunks pulled via `flow/foreach`.
