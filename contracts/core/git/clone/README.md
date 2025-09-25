# Contract: core/git/clone@1

Fetches a Git repository into the runtime workspace, supporting shallow clones and optional subdirectory checkout.

## Input (`schema/clone.in.json`)
- `url` (string) — repository URL (`https://`, `ssh://`, or `git@` syntax).
- `ref` (string, optional) — commit SHA, tag, or branch (defaults to the default branch).
- `depth` (number, optional) — shallow clone depth.
- `subdir` (string, optional) — path relative to repo root to expose; when provided only that subtree is returned.
- `dest` (string, optional) — relative directory name within the workspace when callers need deterministic paths.
- `auth` (object, optional) — credential hints (`token`, `username`, `password`, `sshKeyRef`).

## Output (`schema/clone.out.json`)
- `path` (string) — absolute path to the checkout within the runtime workspace.
- `commit` (string) — resolved commit SHA.
- `ref` (string, optional) — normalized ref (`refs/heads/...`, `refs/tags/...`).
- `subdir` (string, optional) — path actually exposed.
- `source` (object) — metadata about the origin (`url`, `fetchedAt`).

Implementations must respect resolver policies (mirrors, replacements) and cache clones when possible. Errors should include Git exit status and stderr for diagnostics.
