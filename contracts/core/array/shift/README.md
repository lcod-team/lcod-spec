<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://contract/core/array/shift@1.0.0

Return the first element of an array along with the remainder.

## Notes

Remove the first element of an array and return the head/tail pair.

The contract never mutates the provided array. When the array is empty, the
`head` is `null` and `rest` is an empty array.

## Input (`schema/shift.in.json`)
- `items` (array, optional): source array (defaults to `[]`).

## Output (`schema/shift.out.json`)
- `head` (any): first element (or `null` when absent).
- `rest` (array): the remaining items after removing the head.
