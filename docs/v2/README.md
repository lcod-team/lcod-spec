# LCOD v2 Exploration

This folder collects design sketches, diagrams, and notes for a v2 architecture focused on KISS principles.

## Goals
- Express compose logic naturally (minimal `out`/plumbing) while keeping traceability.
- Describe subsystems (run-compose, resolver, scope lookup, etc.) with Mermaid diagrams and drill-down sections.
- Iterate quickly without impacting current v1 behavior.

## Structure
- [`overview.md`](overview.md) – high-level modules diagram.
- [`high-level-approach.md`](high-level-approach.md) – top-down pipeline.
- [`internal-representation.md`](internal-representation.md) – meta + compose format.
- [`kernel-high-level.md`](kernel-high-level.md) – runtime primitives.
- [`scope-model.md`](scope-model.md) – closure rules for slots.
- [`structural-components.md`](structural-components.md) – layout/pipeline components.
- [`exceptions.md`](exceptions.md) – error handling contract.
- [`principes.md`](principes.md) – KISS principles.
- [`roadmap.md`](roadmap.md) – build order & branches.
- `subsystems/` – per-area breakdown (resolver, runtime, tooling, etc.).

Feel free to add new sketches; keep each file focused and reference diagrams from the overview for easy navigation.
