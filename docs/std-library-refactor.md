# Standard Library Refactor Plan

This note analyses the current LCOD standard components, explains why many of them rely on `tooling/script@1`, and outlines the missing building blocks we need to deliver a declarative, composable standard library. The aim is to capture concrete action items for a new milestone focused on rationalising the base library and reducing our dependence on ad-hoc JavaScript snippets.

## 1. Observations

An audit of `lcod-components/packages/std/components/**/compose.yaml` shows **24 components** that invoke `lcod://tooling/script@1`. They fall into three categories:

| Category | Examples | Purpose | Why script was used |
|----------|----------|---------|---------------------|
| Array helpers | `array.append`, `array.compact`, `array.find_duplicates`, `array.flatten`, `array.length`, `array.pluck` | Basic collection transforms (push, filter undefined, flatten nested arrays, pick fields). | No collection slots or primitives exist; implementing these with `flow/foreach` would be verbose and repeated in each component. |
| Object/value helpers | `value.is_array`, `value.is_object`, `value.is_string_nonempty`, `string.ensure_trailing_newline`, `json.stringify`, `jsonl.from_objects` | Type guards and simple string/JSON helpers. | Missing axioms for common predicates/formatting; quick to express in JS. |
| Registry & MCP tooling | `registry_catalog.*`, `fs.write_if_changed`, `mcp.session.open`, `mcp.component.scaffold` | Complex JSON restructuring, filesystem manipulation, scaffolding. | Lack of dedicated “reshape” operators; mapping and grouping logic would require many steps; script offered a quick path while prototyping. |

In summary, our “std lib” lacks:

- **Collection operators** (filter, map, reduce, group, distinct) with slots to inject predicates.
- **Object utilities** (get/set/merge, defaults, picking/removing keys).
- **String/format helpers**.
- **File-system helpers** with richer options (`write_file` already exists but structure building is manual).

Without these primitives, authors naturally fall back to `tooling/script@1`. This blurs the separation between declarative compose logic and bespoke code, and it locks behaviour to QuickJS instead of leveraging native kernels.

## 2. Design goals for the refactor

1. **Minimise script usage**: scripts become the exception, used only when no reusable primitive exists or when hosting user-provided expressions.
2. **Composable primitives**: introduce collection/object/string components that rely on slots and axioms, so they can be combined without writing code.
3. **Kernel support where relevant**: expose small, pure axioms (e.g. “append”, “merge object”) for performance instead of re-implementing them in JS for every compose.
4. **Portable behaviour**: the same components must behave identically across kernels; new axioms must be implemented in both JS & Rust runtimes.
5. **Progressive migration**: keep existing behaviours while refactoring so downstream users are not broken; deprecate script-heavy components gradually.

## 3. Proposed component families

### 3.1 Collections

| Component | Slots | Description |
|-----------|-------|-------------|
| `collection/filter@1` | `predicate` | Iterate over `items`, call predicate slot with `{ item, index }`; keep items where the slot returns `{ keep: true }`. |
| `collection/map@1` | `mapper` | Transform each item via slot returning `{ value }`. |
| `collection/reduce@1` | `accumulator` | Fold array into single value (`accumulator` slot receives `{ acc, item, index }`). |
| `collection/group_by@1` | `key` + optional `value` | Group items by computed key; return object or array of groups. |
| `collection/distinct@1` | `key` | Remove duplicates based on key function. |
| `collection/find@1` | `predicate` | Return first matching item + index. |

These would replace custom scripts in `array.*` components. For convenience we can keep thin wrappers (`array.append` → `collection/map` or direct axiom) but implemented with the new primitives.

### 3.2 Object utilities

| Component / axiom | Behaviour |
|-------------------|-----------|
| `object/get@1` | Read nested property via path array. |
| `object/set@1` | Immutable set of a nested value; returns new object plus optionally the mutated object. |
| `object/merge@1` | Merge two objects (deep or shallow). |
| `object/pick@1`, `object/omit@1` | Select or drop keys. |
| `object/defaults@1` | Apply default values for missing keys. |

Most can be implemented as axioms for performance (`object/set` and `object/merge` are good candidates) while still wrapping them in components for clarity.

### 3.3 String & encoding helpers

| Component | Description |
|-----------|-------------|
| `string/concat@1` | Concatenate list of strings (with optional separator). |
| `string/format@1` | Simple interpolation (`"Hello {name}"`). |
| `string/trim@1`, `string/pad@1`, `string/to_case@1` | Common text transforms. |
| `json/encode@1` / `json/decode@1` | Wrap native JSON stringify/parse with options (indentation, stable keys). |
| `jsonl/from_array@1` | Convert array of objects to JSON Lines without scripting. |

### 3.4 Structural builders

| Component | Description |
|-----------|-------------|
| `struct/create_object@1` | Build object from key-value pairs passed via slots (avoids manual script). |
| `struct/create_array@1` | Build array from child slots. |
| `filesystem/write_if_changed@1` | Re-implement existing script using `core/fs/write-file` + `core/fs/read-file` + primitives (no script). |

### 3.5 Expression evaluation (lightweight)

Instead of general JavaScript, provide a restricted expression lexicon (e.g. [JMESPath](https://jmespath.org/) or a minimal expression engine). This can live behind `tooling/expression/evaluate@1`, allowing:

- simple arithmetic / comparison,
- JSON-path-like value extraction,
- optional custom functions for kernels.

Scripts would then only be required for advanced or user-provided logic; most current scripts are simple enough to fit into these primitives.

## 4. Kernel-level axioms to add

To support the components above efficiently, we should add the following axioms (implemented in both JS and Rust kernels):

| Axiom ID | Behaviour |
|----------|-----------|
| `lcod://axiom/object/get@1` | Return value at JSON path. |
| `lcod://axiom/object/set@1` | Immutable set at path. |
| `lcod://axiom/object/merge@1` | Merge objects (configurable depth). |
| `lcod://axiom/array/push@1` | Append value to array (return new array + length). |
| `lcod://axiom/array/concat@1` | Concatenate arrays. |
| `lcod://axiom/string/format@1` | Interpolation with placeholders. |
| `lcod://axiom/string/trim@1` | Trim left/right/both. |
| `lcod://axiom/json/stringify@1` | JSON stringify with options. |
| `lcod://axiom/json/parse@1` | JSON parse with error reporting. |

Many of these exist informally via script; formalising them as axioms keeps the runtime portable and allows future kernels (Java, Go, Swift) to implement them natively.

## 5. Migration plan

1. **Inventory & classification** (done in §1).  
2. **Design the new components/axioms** (spec definitions, schemas, docs).  
3. **Implement axioms in kernels** (JS & Rust).  
4. **Publish new components in `lcod-components`** using the primitives.  
5. **Refactor existing components** to remove `tooling/script@1` usage.  
6. **Add tests** covering the new primitives and the refactored components.  
7. **Deprecate old script-based components** (announce timeline, maintain backwards compatibility until consumers migrate).  
8. **Update documentation** (`docs/compose-dsl.md`, `docs/guide-ai.md`) to highlight the new building blocks and recommend against inline scripting.

## 6. Roadmap proposal

Introduce a new milestone (e.g. **M8 — Standard library rationalisation**) with sub-tasks:

- M8-01 Spec: define collection/object/string primitive components + schemas.
- M8-02 Kernels: implement supporting axioms (JS + Rust).
- M8-03 Components: publish collection/object/string helpers in `lcod-components`.
- M8-04 Migration: replace existing script-heavy components with the new primitives.
- M8-05 Optional: introduce `tooling/expression/evaluate@1` for lightweight expressions.

This milestone sits *above* the minimal bootstrap: kernels/resolver stay lean, while the standard library gains the expressive power needed to model real-world apps without dropping to QuickJS.

## 7. Next steps

1. Review and agree on the component/axiom list above.  
2. Add the milestone to the relevant roadmaps (`lcod-spec`, `lcod-components`, kernels).  
3. Start with the array/object primitives (they will eliminate most current scripts).  
4. Gradually refactor the registry/MCP tooling to rely on these primitives instead of scripts.
