# Structural components (LCOD v2)

## 1. Purpose
Not every component is purely algorithmic: some describe structures (layout, pipeline, page). Slots become named positions to organize children.

## 2. Categorized slots
- A component may expose multiple slots (`header`, `body`, `footer`, `sidebar`, ...).
- Each slot can accept zero or more children (cardinality, optional flag, read-only behavior).
- Children may themselves be structural or algorithmic.

## 3. Required introspection
To navigate these structures (LLM or human) we must list:
- Slots and their descriptions.
- Actual children wired into each slot (from the AST).
- Hierarchical links (Mermaid graphs, trees). Hence the need for `meta + ast` and the introspection tooling.

## 4. Examples
- `layout/page@1`: slots `header`, `content`, `footer`.
- `pipeline/handler@1`: slots `before`, `after`, `error`.
- `tooling/testkit/unit@1`: slot `compose` encapsulating a test plan.

## 5. Implications
- Kernels execute structural components like any compose: run each slot when present.
- Tooling (docs, RAG, plan) must extract the structure for visualization and search.
- Slots may enforce constraints (child type, cardinality) described in `meta` (JSON Schema, validation).

```mermaid
graph TD
  Page(layout/page@1)
  Page -->|header| HeaderSlot
  Page -->|content| ContentSlot
  Page -->|footer| FooterSlot
  HeaderSlot --> ComponentA
  ContentSlot --> ComponentB
  FooterSlot --> ComponentC
```
