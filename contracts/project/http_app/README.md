<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://project/http_app@0.1.0

HTTP project contract that exposes sequences and API routes to a host.

## Notes

Represents a logical HTTP project. The project provides configuration metadata
(name, base path, optional tags) and exposes two slots:

- `sequences` — business logic blocks that can be invoked when a route is hit.
- `apis` — route descriptors that bind HTTP requests to sequences.

The HTTP host invokes these slots when registering the project and merges the
returned data into its routing table.
