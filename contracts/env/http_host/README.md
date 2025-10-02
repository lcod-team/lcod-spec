# Contract: env/http_host@0.1.0

Defines the contract for an HTTP hosting environment. The component receives the
basic network configuration (host, port, optional base path) and exposes a slot
`projects` that lets compose authors attach one or more HTTP projects.

Each project is expected to resolve to `lcod://project/http_app@0.1.0` (or a
compatible contract). The host implementation is responsible for invoking the
`projects` slot, collecting the routes returned by each project, and registering
them on the HTTP server.

## Inputs (`schema/http_host.in.json`)

- `host` (string) — network interface to bind to (default `0.0.0.0`).
- `port` (integer) — TCP port to listen on.
- `basePath` (string, optional) — optional prefix applied to all child routes.
- `metadata` (object, optional) — free-form data forwarded to child projects.

## Outputs (`schema/http_host.out.json`)

- `url` (string) — base URL once the server is started.
- `routes` (array) — list of route descriptors registered by child projects.
- `projects` (array) — resolved project descriptors (useful for tooling/IDE).

## Slots

- `projects` — executed once per HTTP project. Each child should return a
  descriptor with its routes (see `project/http_app`).

Implementations should surface lifecycle hooks (start/stop) and map runtime
errors to structured LCOD errors so compose flows can react accordingly.
