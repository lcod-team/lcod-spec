# Packaging Pipeline (Assemble → Ship → Build)

This document describes the three packaging stages used in LCOD projects. The spec defines the artefact layout; resolver/kernels implement the commands that produce them.

```
assemble   →   ship   →   build
(bundle)      (runtime)   (platform executable)
```

## 1. Assemble

`assemble` creates a self-contained bundle that captures everything needed to run a compose with an existing kernel installation.

### 1.1 Bundle Layout

```
my-service.lcod/
  lcp.lock              # lockfile capturing resolved components
  compose.yaml          # normalized compose or project manifest
  lcod_modules/
    lcod://tooling/resolver/context@0.1.0/
      compose.yaml
      schemas/
    ... (all resolved components)
  assets/               # optional static files required at runtime
  README.md             # optional bundle notes
```

Guidelines:

- `lcod_modules/` mirrors the resolved component IDs (with URL-safe encoding) and includes compose, schemas, and supporting files.
- `assets/` stores static resources referenced by the compose (templates, JSON fixtures, etc.).
- The bundle remains editable: teams can tweak config, run tests, or inspect the compose offline.

### 1.2 CLI Support

- `lcod-resolver assemble --project path --output bundle.lcod`
  - Runs resolution, writes `lcp.lock`, copies components under `lcod_modules/`.
  - Optionally copies `compose.yaml` and project assets specified in `resolve.config.json`.
- Kernels (`lcod-kernel-js`, `lcod-kernel-rs`, and `lcod-kernel-java` when the CLI parity lands) accept `--bundle bundle.lcod` to execute the compose using files from the bundle.

## 2. Ship

`ship` produces a runnable artefact that embeds a kernel runtime alongside the bundle. It targets environments where running the resolver or installing the kernel is not desirable.

### 2.1 Artefact Types

- **Node**: packaged as npm tarball or Docker image containing the Node kernel, the bundle, and a launcher (`node index.js`).
- **Rust**: compiled binary with embedded `lcod_modules/` (using `include_bytes!` or runtime extraction) plus CLI flags.
- **Java**: shaded Jar produced via the Gradle Shadow plugin (optionally followed by GraalVM native-image) bundling the compose assets alongside the runner.
- **Generic**: Docker/OCI image with resolved bundle mounted under `/app` and entrypoint executing the kernel CLI.

### 2.2 CLI Support

- `lcod-resolver ship --bundle bundle.lcod --target node --output service.tgz`
- `lcod-resolver ship --bundle bundle.lcod --target docker --output Dockerfile`

The command may accept `--runtime` to select a specific kernel version, and `--entry` to override the launcher.

## 3. Build

`build` generates platform-optimised executables or deployables (e.g. Node single-file bundle, Rust static binary, JVM fat JAR).

### 3.1 Node Target

- Uses esbuild/webpack to bundle the kernel + bundle + launcher into one JS file.
- Optional native snapshot to reduce startup time.

### 3.2 Rust Target

- Leverages `cargo build --release` with embedded bundle and optional cross-compilation.
- Produces a self-contained binary ready for distribution.

### 3.3 JVM Target (future)

- Generates a classpath with the compose bundle, wraps with GraalVM native-image if required once the Java kernel exposes flow/core parity.

## 4. Responsibilities

| Stage    | Spec responsibilities                     | Resolver responsibilities                                  | Kernel responsibilities                                 |
|----------|--------------------------------------------|------------------------------------------------------------|---------------------------------------------------------|
| assemble | Define bundle layout, schema & metadata    | Implement `assemble`, produce bundle, verify hashes        | Load bundle via CLI (`--bundle`)                        |
| ship     | Specify runtime metadata requirements      | Implement `ship`, compose bundle + runtime, produce image | Provide launchers or embeddable runtime modules        |
| build    | Provide target-specific guidance/metadata  | Drive build command (`--build`) and orchestrate toolchain | Expose APIs to embed bundle; document build options     |

## 5. Next Steps

- Update `lcod-resolver` to implement `assemble/ship/build` commands.
- Extend kernel docs (`docs/runtime-node.md`, `docs/runtime-rust.md`, `docs/runtime-java.md`) with instructions for consuming bundles.
- Create design tickets for optional runtime metadata (e.g. environment variables, secrets management).
