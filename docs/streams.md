# Streams and Chunked Processing

Some contracts produce or consume data incrementally. LCOD models this with AsyncIterables while keeping deterministic compose flows. When a contract returns a reusable stream handle, see [docs/core-streams.md](core-streams.md) for the standard contracts (`core/stream/read@1`, `core/stream/close@1`).

## Source forms

- **Arrays (`in.list`)** — materialized collections; iteration order is deterministic.
- **AsyncIterables (`in.stream`)** — pull-based sequences (`for await`); items may arrive over time (e.g. network pages, database cursors).
- **Mixed** — implementations may accept both; use feature detection to decide which parameter to populate.

## foreach semantics

`lcod://flow/foreach@1` handles both arrays and streams:

1. If `in.stream` is provided it is consumed with `for await`.
2. Each item executes the `body` slot with `$slot.item` and `$slot.index`.
3. `collectPath` (when present) evaluates against `{ $: iterationState, $slot }` and appends to an internal array.
4. When the sequence is empty, the optional `else` slot runs once; `collectPath` evaluates against its state with `$slot.index = -1`.
5. `flow/continue@1` / `flow/break@1` inside the body signal loop control. Break stops iteration without draining the remaining stream.

## Backpressure hints

The following hints may be provided in the `in` bindings of flow operators. They are advisory; hosts decide whether and how to apply them.

| Hint         | Description                                                     |
|--------------|-----------------------------------------------------------------|
| `parallelism`| Maximum number of concurrent iterations. `1` enforces sequential processing even for streams.|
| `prefetch`   | Desired number of buffered items fetched ahead of time.         |
| `ordered`    | When `false`, results may be emitted in completion order instead of input order.|

Implementations should treat missing hints as host defaults. The current kernel executes sequentially; future substrates may leverage these hints for concurrency.

## Resource management

- Use `flow/try@1` + `finally` to guarantee cleanup of stream resources (closing connections, releasing file handles).
- Implementations may call `ctx.defer(fn)` to register cleanup when leaving a scope (see kernel docs).
- When breaking out of a foreach loop early, hosts should abort the underlying iterator if it exposes a `return()` method.

## Error propagation

Errors thrown inside the body bubble up to the nearest `flow/try@1`. When using streams, an error may arrive asynchronously; the kernel surfaces it immediately and stops iteration.

## Memory guidance

Streams often pair with `outPolicy = "ephemeral"` or `releasePrevious = true` (see `docs/memory.md`) to prevent retaining large datasets. Avoid storing entire streams in `collectPath` unless necessary.

## Examples

- `examples/flow/foreach_demo` — array iteration with collection
- `examples/flow/foreach_ctrl_demo` — continue/break control flow and else slot fallback

For slot semantics and binding syntax refer to `docs/dsl-slots.md` and `docs/compose-dsl.md`.
