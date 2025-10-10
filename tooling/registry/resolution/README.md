# Registry Resolution (`tooling/registry/resolution@0.1.0`)

Wraps the registry helpers into a single call:

1. Load sources via `tooling/registry/source/load@0.1.0`.
2. Index JSONL streams with `tooling/registry/index@0.1.0`.
3. For each requested component (id + optional range), select the best entry using
   `tooling/registry/select@0.1.0`.

Outputs the registry metadata plus the chosen entries, ready to be consumed by the
resolver compose.
