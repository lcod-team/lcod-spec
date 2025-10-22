<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://env/http_host@0.1.0

HTTP environment contract that launches an HTTP server and registers child projects.

## Notes

Defines the contract for an HTTP hosting environment. The component receives the
basic network configuration (host, port, optional base path) and exposes a slot
`projects` that lets compose authors attach one or more HTTP projects.

Each project is expected to resolve to `lcod://project/http_app@0.1.0` (or a
compatible contract). The host implementation is responsible for invoking the
`projects` slot, collecting the routes returned by each project, and registering
them on the HTTP server.
