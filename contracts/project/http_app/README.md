# Contract: project/http_app@0.1.0

Represents a logical HTTP project. The project provides configuration metadata
(name, base path, optional tags) and exposes two slots:

- `sequences` — business logic blocks that can be invoked when a route is hit.
- `apis` — route descriptors that bind HTTP requests to sequences.

The HTTP host invokes these slots when registering the project and merges the
returned data into its routing table.

## Inputs (`schema/http_app.in.json`)

- `name` (string) — project identifier (used for namespacing sequences/routes).
- `basePath` (string) — URL prefix under which the project is mounted.
- `metadata` (object, optional) — arbitrary project configuration (auth, feature flags).

## Outputs (`schema/http_app.out.json`)

- `routes` (array) — list of route descriptors produced by the `apis` slot.
- `sequences` (array) — resolved sequence descriptors produced by the `sequences` slot.
- `project` (object) — merged project metadata (name, basePath, tags, etc.).

Implementations should ensure that sequence identifiers are unique within the
project and that routes reference valid sequence IDs.
