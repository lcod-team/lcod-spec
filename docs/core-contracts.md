# Infrastructure Contracts (M3)

This note tracks the core contracts that anchor the runtime substrates milestone.

| Namespace | Contract ID | Purpose | Status |
|-----------|-------------|---------|--------|
| `core/fs` | `lcod://contract/core/fs/read-file@1` | Read file contents with optional encoding. | ✅ |
| `core/fs` | `lcod://contract/core/fs/write-file@1` | Persist data to disk with encoding/permissions controls. | ✅ |
| `core/fs` | `lcod://contract/core/fs/list-dir@1` | Enumerate directory entries (files/folders, metadata). | ✅ |
| `core/fs` | `lcod://contract/core/fs/stat@1` | Inspect filesystem metadata (exists, type, size, timestamps). | ✅ |
| `core/http` | `lcod://contract/core/http/request@1` | Perform HTTP requests with headers, body, streaming TBD. | ✅ |
| `core/stream` | `lcod://contract/core/stream/read@1` | Pull the next chunk from a reusable stream handle. | ✅ |
| `core/stream` | `lcod://contract/core/stream/close@1` | Release a stream handle and optionally delete backing storage. | ✅ |
| `core/git` | `lcod://contract/core/git/clone@1` | Fetch a Git repository (url/ref/subdir) onto local storage. | ✅ |
| `core/hash` | `lcod://contract/core/hash/sha256@1` | Compute SHA-256 over buffers/streams for integrity. | ✅ |
| `core/parse` | `lcod://contract/core/parse/json@1` | Parse JSON strings/buffers into canonical objects. | ✅ |
| `core/parse` | `lcod://contract/core/parse/toml@1` | Parse TOML descriptors (mirrors @iarna/toml behaviour). | ✅ |
| `core/array` | `lcod://contract/core/array/length@1` | Return the number of elements in an array. | ✅ |
| `core/array` | `lcod://contract/core/array/push@1` | Append a value to an array. | ✅ |
| `core/array` | `lcod://contract/core/array/append@1` | Concatenate arrays or append a single value (immutable). | ✅ |
| `core/object` | `lcod://contract/core/object/get@1` | Retrieve a nested value from an object. | ✅ |
| `core/object` | `lcod://contract/core/object/set@1` | Assign a nested value on an object. | ✅ |
| `core/object` | `lcod://contract/core/object/merge@1` | Merge two objects (optional deep merge). | ✅ |
| `core/string` | `lcod://contract/core/string/format@1` | Format a template string using named placeholders. | ✅ |
| `core/string` | `lcod://contract/core/string/trim@1` | Trim whitespace from strings (start/end/both). | ✅ |
| `core/value` | `lcod://contract/core/value/kind@1` | Report the JSON kind (null, boolean, number, string, array, object). | ✅ |
| `core/value` | `lcod://contract/core/value/equals@1` | Deep equality comparison between two JSON values. | ✅ |
| `core/value` | `lcod://contract/core/value/clone@1` | Produce a deep clone of a JSON value. | ✅ |
| `core/number` | `lcod://contract/core/number/trunc@1` | Truncate numbers toward zero (integer coercion). | ✅ |
| `core/string` | `lcod://contract/core/string/split@1` | Split strings by literal separators (with trimming/filtering options). | ✅ |
| `core/json` | `lcod://contract/core/json/encode@1` | Serialize structured data into JSON text. | ✅ |
| `core/json` | `lcod://contract/core/json/decode@1` | Parse inline JSON text into structured data. | ✅ |
| `core/env` | `lcod://contract/core/env/get@1` | Resolve environment variables with optional defaults. | ✅ |
| `core/runtime` | `lcod://contract/core/runtime/info@1` | Surface cwd/home/tmp/platform metadata for the current process. | ✅ |

Follow-up work will extend the list for streaming APIs (HTTP download/upload) once the first wave is stable.

Each contract should ship with:

- `lcp.toml` descriptor (`kind = "contract"`).
- `schema/*.in.json` / `schema/*.out.json` covering arguments and return data.
- `README.md` documenting expected behaviours and error codes.
- Optional test fixtures under `tests/` once implementations exist.

When a contract is delivered, update `ROADMAP.md` (section M3-01) and cross-link the spec issue tracker.
