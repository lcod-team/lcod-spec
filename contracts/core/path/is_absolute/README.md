# lcod://contract/core/path/is_absolute@1.0.0

Determine whether a string represents an absolute path (POSIX or Windows semantics).

## Input (`schema/is_absolute.in.json`)
- `path` (string, optional): path candidate. Defaults to the empty string.

## Output (`schema/is_absolute.out.json`)
- `absolute` (boolean): `true` when the path is absolute, otherwise `false`.
