# Contract: http/api_route@0.1.0

Defines the shape of an HTTP route descriptor. Projects use this contract to
describe how incoming requests should be forwarded to sequence handlers.

## Inputs (`schema/api_route.in.json`)

- `method` (string) — HTTP method (GET, POST, ...).
- `path` (string) — URL pattern relative to the project base path.
- `sequenceId` (string) — identifier of the sequence to invoke.
- `description` (string, optional) — human-readable summary.
- `middlewares` (array, optional) — optional list of middleware identifiers.

## Outputs (`schema/api_route.out.json`)

- `route` (object) — canonical route descriptor (method, path, handler metadata).

Hosts are free to augment the descriptor with runtime-specific fields (e.g.
compiled regex, authorization policy). Those additional properties should be
namespaced to avoid collisions.
