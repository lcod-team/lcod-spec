<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://tooling/queue/bfs@0.1.0

Thin wrapper around the kernel BFS contract for registry queues.

## Inputs

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `items` | array | No | Queue of pointers to process. |
| `state` | object | No | Accumulator state carried across iterations. |
| `maxIterations` | any | No | Maximum number of iterations before aborting. |
| `visited` | object | No | Set of visited keys to avoid processing duplicates. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `state` | object | Final accumulator state after traversal. |
| `visited` | object | Visited keys recorded during traversal. |
| `warnings` | array | Warnings emitted by the traversal. |
| `iterations` | integer | Number of iterations performed. |
