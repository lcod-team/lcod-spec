# Quickstart — Validate and Run an LCOD Component

This walkthrough uses the spec repository plus the TypeScript kernel to validate and execute the demo packages.

## Prerequisites
- Node.js 18+
- `lcod-spec` and `lcod-kernel-ts` cloned side by side

```
~/git/lcod-spec
~/git/lcod-kernel-ts
```

## 1. Validate the example packages

```
cd ~/git/lcod-spec
npm install
npm run validate         # strict Ajv 2020 + TOML parsing
```

This enforces `schema/lcp.schema.json`, checks schema references, and reports missing files.

## 2. Validate from the kernel (optional per-package lint)

```
cd ~/git/lcod-kernel-ts
npm install
npm run validate:lcp -- ../lcod-spec/examples/flow/foreach_ctrl_demo
```

You can pass a directory or an explicit `lcp.toml` path.

## 3. Run a demo composition

```
cd ~/git/lcod-kernel-ts
node bin/run-compose.mjs \
  --compose ../lcod-spec/examples/flow/foreach_ctrl_demo/compose.json \
  --demo \
  --state ../lcod-spec/examples/flow/foreach_ctrl_demo/schema/foreach_ctrl_demo.in.json
```

The `--demo` flag registers built-in axioms/flow blocks so that the compose file resolves locally. Adjust `--state` to feed custom inputs.

## 4. Next steps
- Create your own package following `docs/create-component.md`
- Validate with `npm run validate:lcp -- <path>`
- Run it via `bin/run-compose.mjs`
- Capture resolver bindings and lockfiles for reproducible builds (planned in M2)

