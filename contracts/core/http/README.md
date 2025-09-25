# Contract: core/http/request@1

Performs an HTTP request (client-side) and returns status, headers, and body with optional streaming metadata.

## Input (`schema/request.in.json`)
- `method` (string, optional) — HTTP method (default `GET`).
- `url` (string) — absolute URL (HTTP/HTTPS).
- `headers` (object, optional) — map of header names to string or string array values.
- `query` (object, optional) — key/value pairs appended to the query string.
- `body` (string/object, optional) — payload to send. If `bodyEncoding` is `json`, the value is JSON-encoded; `base64` expects a base64 string.
- `bodyEncoding` (string, optional) — `none` (default), `json`, `base64`, `form` (application/x-www-form-urlencoded).
- `timeoutMs` (number, optional) — override request timeout in milliseconds.
- `followRedirects` (boolean, optional) — whether to follow redirects (defaults to `true`).
- `expectStreaming` (boolean, optional) — set `true` if the caller expects a streamed response (chunked download).

## Output (`schema/request.out.json`)
- `status` (number) — HTTP status code.
- `statusText` (string, optional) — status message (e.g. "OK").
- `headers` (object) — response headers as string arrays.
- `body` (string, optional) — response body. Encoding is specified by `bodyEncoding`.
- `bodyEncoding` (string, optional) — `utf-8`, `base64`, or `json` to indicate how `body` is encoded.
- `timings` (object, optional) — `start`, `end`, `durationMs` for diagnostics.
- `redirects` (array, optional) — sequence of redirect URLs followed.

Implementations should map network errors to structured error codes (e.g. `ECONNREFUSED`, `ETIMEDOUT`) and must respect TLS validation policies of the host runtime.
