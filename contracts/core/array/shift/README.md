# lcod://contract/core/array/shift@1.0.0

Remove the first element of an array and return the head/tail pair without mutating the original list.

## Input (`schema/shift.in.json`)
- `items` (array, optional): source array. Defaults to an empty array.

## Output (`schema/shift.out.json`)
- `head` (any): the first element (or `null` when the array is empty).
- `rest` (array): the remaining elements after removing the head.
