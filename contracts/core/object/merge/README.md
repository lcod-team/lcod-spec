# Contract: core/object/merge@1

Merges two objects and returns a new object containing the combined properties.
By default the merge is shallow (top-level keys). When `deep` is enabled, nested
objects are merged recursively.

## Inputs (`schema/merge.in.json`)

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| `left` | object | yes | Base object. Never mutated. |
| `right` | object | yes | Object whose fields overwrite `left` on conflict. |
| `deep` | boolean | no | When `true`, merge nested objects recursively. |
| `arrayStrategy` | string | no | How to merge arrays when `deep` is true. Defaults to `replace`. |

`arrayStrategy` accepts:
- `replace` — `right` arrays replace `left` arrays.
- `concat` — concatenates arrays (`left` + `right`).

## Outputs (`schema/merge.out.json`)

| Field | Type | Description |
| ----- | ---- | ----------- |
| `value` | object | Result of the merge. |
| `conflicts` | array | Optional list of keys that were overwritten (top-level). |

Implementations must not mutate inputs. Keys are compared using the standard JS
semantics (`===`). Non-object values (`null`, arrays, primitives) are assigned
verbatim from `right`.
