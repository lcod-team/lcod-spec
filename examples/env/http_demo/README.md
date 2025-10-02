# Example: env/http_demo

Illustrates how HTTP environments can be composed using the new contracts:

- `lcod://env/http_host@0.1.0` — wraps the HTTP server.
- `lcod://project/http_app@0.1.0` — describes a project with routes and sequences.
- `lcod://http/api_route@0.1.0` — declares a single HTTP endpoint.

The example defines a `catalog` project that exposes a single
`GET /api/catalog/items` route returning hard-coded data via `tooling/script@1`
and canonicalizes the route using `http/api_route@0.1.0`.

This compose is declarative and does not start a server on its own. The Node and
Rust kernels will provide implementations of the contracts to turn this compose
into a running service.
