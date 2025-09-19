# Packaging (`.lcpkg`)

A package archive bundles a component directory (`lcp.toml`, schemas, implementations, docs).

## Format

- `.lcpkg` is a tar archive (no compression by default).
- Root contains `lcp.toml`; relative paths preserved.
- Integrity recorded in `lcp.lock` via `hash/sha256`.

## Prototype CLI

```
node scripts/pack-lcp.cjs examples/demo/my_weather
```

Outputs `my_weather.lcpkg` next to the component.

Future work: sign archives, include manifest with hash list, support compressed variants.
