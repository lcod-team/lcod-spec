# resolver/warnings/merge

Simple utility to merge warning arrays from different resolver stages. Each non-empty string from the provided buckets is appended to the result, preserving order. Non-array buckets and falsy entries are ignored.
