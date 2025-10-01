# Test: core filesystem roundtrip

Ensures the `core/fs` contracts can write, read and list files within the
sandbox. The harness writes to a local temporary directory, reads the content
back and verifies the entry appears in the directory listing.
