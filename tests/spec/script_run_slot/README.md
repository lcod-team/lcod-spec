# Test: script_run_slot expectation

Ensures `tooling/script@1` can invoke a child slot and emit log messages. The
script forwards a payload to the `child` slot, captures its result, and returns
both the success flag and the child output.
