# Infrastructure Contracts (M3)

This note tracks the core contracts that anchor the runtime substrates milestone.

| Namespace | Contract ID | Purpose | Status |
|-----------|-------------|---------|--------|
| `core/fs` | `lcod://contract/core/fs/read-file@1` | Read file contents with optional encoding. | ✅ |
| `core/fs` | `lcod://contract/core/fs/write-file@1` | Persist data to disk with encoding/permissions controls. | ✅ |
| `core/fs` | `lcod://contract/core/fs/list-dir@1` | Enumerate directory entries (files/folders, metadata). | ✅ |
| `core/http` | `lcod://contract/core/http/request@1` | Perform HTTP requests with headers, body, streaming TBD. | ✅ |
| `core/git` | `lcod://contract/core/git/clone@1` | Fetch a Git repository (url/ref/subdir) onto local storage. | ⏳ |
| `core/hash` | `lcod://contract/core/hash/sha256@1` | Compute SHA-256 over buffers/streams for integrity. | ⏳ |
| `core/parse` | `lcod://contract/core/parse/json@1` | Parse JSON strings/buffers into canonical objects. | ⏳ |
| `core/parse` | `lcod://contract/core/parse/toml@1` | Parse TOML descriptors (mirrors @iarna/toml behaviour). | ⏳ |

Follow-up work will extend the list for streaming APIs (HTTP download/upload) once the first wave is stable.

Each contract should ship with:

- `lcp.toml` descriptor (`kind = "contract"`).
- `schema/*.in.json` / `schema/*.out.json` covering arguments and return data.
- `README.md` documenting expected behaviours and error codes.
- Optional test fixtures under `tests/` once implementations exist.

When a contract is delivered, update `ROADMAP.md` (section M3-01) and cross-link the spec issue tracker.
