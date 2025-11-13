# lcod://contract/core/path/dirname@1.0.0

Return the directory portion of a POSIX/Windows-style path. Trailing separators are ignored (unless the path is the root itself) and `.` is returned when no parent directory exists.

## Input (`schema/dirname.in.json`)
- `path` (string, optional): path to inspect. Defaults to the empty string.

## Output (`schema/dirname.out.json`)
- `dirname` (string): parent directory or `.` when none can be derived.
