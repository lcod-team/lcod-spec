<!-- AUTO-GENERATED: edit lcp.toml and run scripts/build-component-artifacts.mjs -->
# lcod://contract/core/http/request@1.0.0

Perform an HTTP request with configurable method, headers, body, and streaming hints.

## Notes

Performs an HTTP request (client-side) and returns status, headers, and either a buffered body or a reusable stream handle.

## Input (`schema/request.in.json`)
- `method` (string, optional) — HTTP method (default `GET`).
- `url` (string) — absolute URL (HTTP/HTTPS).
- `headers` (object, optional) — map of header names to string or string array values.
- `query` (object, optional) — key/value pairs appended to the query string.
- `body` (string/object, optional) — payload to send. If `bodyEncoding` is `json`, the value is JSON-encoded; `base64` expects a base64 string.
- `bodyEncoding` (string, optional) — `none` (default), `json`, `base64`, `form` (application/x-www-form-urlencoded).
- `timeoutMs` (number, optional) — override request timeout in milliseconds.
- `followRedirects` (boolean, optional) — whether to follow redirects (defaults to `true`).
- `expectStreaming` (boolean, optional) — hint that the caller expects a streamed response (chunked download).
- `responseMode` (string, optional) — `buffer` (default) or `stream`. When `stream`, the response body is exposed as a handle for `core/stream/read@1`.

## Output (`schema/request.out.json`)
- `status` (number) — HTTP status code.
- `statusText` (string, optional) — status message (e.g. "OK").
- `headers` (object) — response headers as string arrays.
- `body` (string, optional) — response body when `responseMode = buffer`. Encoding is specified by `bodyEncoding`.
- `bodyEncoding` (string, optional) — `utf-8`, `base64`, or `json` to indicate how `body` is encoded.
- `stream` (object, optional) — stream handle when `responseMode = stream`; see `core/stream/read@1` for the handle shape.
- `timings` (object, optional) — `start`, `end`, `durationMs` for diagnostics.
- `redirects` (array, optional) — sequence of redirect URLs followed.

Implementations should map network errors to structured error codes (e.g. `ECONNREFUSED`, `ETIMEDOUT`) and must respect TLS validation policies of the host runtime.
