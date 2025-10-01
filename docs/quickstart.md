# Quickstart — Validate and Run an LCOD Component

This walkthrough uses the spec repository plus the TypeScript kernel to validate and execute the demo packages.

## Prerequisites
- Node.js 18+
- `lcod-spec` and `lcod-kernel-js` cloned side by side

```
~/git/lcod-spec
~/git/lcod-kernel-js
```

## 1. Validate the example packages

```
cd ~/git/lcod-spec
npm install
npm run validate         # strict Ajv 2020 + TOML parsing
# Optional: generate a prototype lockfile for an example
node scripts/create-lock.cjs examples/demo/my_weather/lcp.toml
```

This enforces `schema/lcp.schema.json`, checks schema references, and reports missing files.

## 2. Validate from the kernel (optional per-package lint)

```
cd ~/git/lcod-kernel-js
npm install
npm run validate:lcp -- ../lcod-spec/examples/flow/foreach_ctrl_demo
```

You can pass a directory or an explicit `lcp.toml` path.

## 3. Run a demo composition

```
cd ~/git/lcod-kernel-js
node bin/run-compose.mjs \
  --compose ../lcod-spec/examples/flow/foreach_ctrl_demo/compose.yaml \
  --demo \
  --state ../lcod-spec/examples/flow/foreach_ctrl_demo/schema/foreach_ctrl_demo.in.json
```

The `--demo` flag registers built-in axioms/flow blocks so that the compose file resolves locally. Adjust `--state` to feed custom inputs.

## 4. Next steps
- Create your own package following `docs/create-component.md`
- Validate with `npm run validate:lcp -- <path>`
- Run it via `bin/run-compose.mjs`
- Execute the shared spec fixtures: `npm run test:spec` (Node kernel) or `cargo run --bin test_specs` (Rust kernel) to ensure behaviour parity
- Capture resolver bindings and lockfiles for reproducible builds (planned in M2)

## 5. Resolve & package (prototype)

Example pipeline combining the resolver CLI and packer:

```
# Generate lockfile using the Node resolver prototype
cd ~/git/lcod-kernel-js
npm run resolve -- --project ../lcod-spec/examples/demo/my_weather

# Package the component as .lcpkg
cd ~/git/lcod-spec
node scripts/pack-lcp.cjs examples/demo/my_weather
```

The resolver reads optional `resolve.config.json`; packaging emits a tar archive (`my_weather.lcpkg`). Future versions will integrate advanced fetch strategies and signing.
