# load-descriptor

Loads the canonical `lcp.toml` descriptor of a project. It joins the incoming `projectPath` with `lcp.toml`, reads the file as UTF-8, parses it via the TOML axiom, and exposes the parsed `descriptor` together with the raw `descriptorText` and absolute `descriptorPath`.

## Inputs

- `projectPath` (string, required): Root directory of the LCOD project.

## Outputs

- `descriptorPath` (string): Absolute path to `lcp.toml`.
- `descriptorText` (string): Raw descriptor contents.
- `descriptor` (object): Parsed TOML payload.
