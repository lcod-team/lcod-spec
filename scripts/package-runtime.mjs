#!/usr/bin/env node
/**
 * package-runtime.mjs
 *
 * Build the LCOD runtime bundle archive so kernels and CI pipelines can
 * consume resolver/spec helpers without cloning the repositories.
 *
 * Usage:
 *   node scripts/package-runtime.mjs [--output dist/runtime] [--version 0.1.0]
 *       [--label v0.1.0] [--resolver /path/to/lcod-resolver] [--keep] [--dry-run]
 *
 * The script copies the required directories into a staging folder, writes a
 * manifest with metadata (spec + resolver revisions), and emits
 * `lcod-runtime-<label>.tar.gz` inside the output directory.
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tar from 'tar';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

async function main() {
  const options = parseArgs(process.argv.slice(2));

  const specVersion = await readPackageVersion();
  const specCommit = git(['rev-parse', 'HEAD']).trim();
  const label =
    options.label ??
    (specVersion && specVersion !== '0.0.0'
      ? `v${specVersion}`
      : `dev-${specCommit.slice(0, 7)}`);
  const outputDir = path.resolve(
    repoRoot,
    options.output ?? path.join('dist', 'runtime')
  );
  const resolverRoot = await resolveResolverRepo(options.resolver);
  const resolverSnapshot = await readResolverSnapshot(resolverRoot);

  const bundleName = `lcod-runtime-${label}`;
  const stagingDir = path.join(outputDir, bundleName);
  const archivePath = path.join(outputDir, `${bundleName}.tar.gz`);

  await fs.mkdir(outputDir, { recursive: true });
  await fs.rm(stagingDir, { recursive: true, force: true });

  if (options.dryRun) {
    console.log(`[dry-run] Preparing runtime bundle ${bundleName}`);
  } else {
    console.log(`Preparing runtime bundle ${bundleName}`);
  }

  if (!options.dryRun) {
    await fs.mkdir(stagingDir, { recursive: true });
    await copySpecContents(stagingDir);
    await copyResolverWorkspace(stagingDir, resolverRoot);
    await copyResolverSnapshot(stagingDir, resolverSnapshot);
    await writeManifest(stagingDir, {
      label,
      specVersion,
      specCommit,
      resolverSnapshot,
    });

    await verifyRequiredFiles(stagingDir);

    await fs.rm(archivePath, { force: true });
    await tar.create(
      {
        cwd: outputDir,
        gzip: true,
        file: archivePath,
      },
      [bundleName]
    );
  }

  if (!options.keep) {
    await fs.rm(stagingDir, { recursive: true, force: true });
  } else {
    console.log(`Staging directory retained at ${stagingDir}`);
  }

  if (!options.dryRun) {
    console.log(`Runtime bundle created: ${archivePath}`);
  }
}

function parseArgs(argv) {
  const options = {
    keep: false,
    dryRun: false,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    switch (arg) {
      case '--output':
        options.output = argv[++i];
        break;
      case '--label':
        options.label = argv[++i];
        break;
      case '--version':
        options.version = argv[++i];
        break;
      case '--resolver':
        options.resolver = argv[++i];
        break;
      case '--keep':
        options.keep = true;
        break;
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--help':
      case '-h':
        printUsage();
        process.exit(0);
        break;
      default:
        if (arg.startsWith('--')) {
          throw new Error(`Unknown option: ${arg}`);
        }
    }
  }
  if (options.version && !options.label) {
    options.label = `v${options.version}`;
  }
  return options;
}

function printUsage() {
  console.log(`package-runtime.mjs

Build the LCOD runtime bundle archive.

Options:
  --output <dir>     Output directory for staging + archive (default: dist/runtime)
  --label <name>     Label used for the bundle folder/archive (default: version or dev-<sha>)
  --version <ver>    Explicit spec version (implies label v<ver>)
  --resolver <path>  Path to the lcod-resolver checkout (default: env or sibling repo)
  --keep             Keep the staging directory after bundling
  --dry-run          Only perform validation, do not emit files
  --help, -h         Show this message
`);
}

async function readPackageVersion() {
  const packagePath = path.join(repoRoot, 'package.json');
  const raw = await fs.readFile(packagePath, 'utf-8');
  const pkg = JSON.parse(raw);
  return pkg.version ?? '0.0.0';
}

function git(args, options = {}) {
  return execFileSync('git', args, {
    cwd: repoRoot,
    encoding: 'utf-8',
    ...options,
  });
}

async function resolveResolverRepo(explicitPath) {
  const candidates = [];
  if (explicitPath) {
    candidates.push(explicitPath);
  }
  if (process.env.RESOLVER_REPO_PATH) {
    candidates.push(process.env.RESOLVER_REPO_PATH);
  }
  candidates.push(path.resolve(repoRoot, '..', 'lcod-resolver'));
  candidates.push(path.resolve(repoRoot, '..', '..', 'lcod-resolver'));

  for (const candidate of candidates) {
    if (!candidate) continue;
    const resolved = path.resolve(candidate);
    try {
      const stat = await fs.stat(resolved);
      if (stat.isDirectory()) {
        const snapshotPath = path.join(
          resolved,
          'runtime',
          'lcod-resolver-runtime.json'
        );
        await fs.access(snapshotPath);
        return resolved;
      }
    } catch (err) {
      // Ignore missing candidate
    }
  }
  throw new Error(
    'Unable to locate lcod-resolver repository with runtime snapshot. Set RESOLVER_REPO_PATH or generate runtime/lcod-resolver-runtime.json first.'
  );
}

async function readResolverSnapshot(resolverRoot) {
  const snapshotPath = path.join(
    resolverRoot,
    'runtime',
    'lcod-resolver-runtime.json'
  );
  const raw = await fs.readFile(snapshotPath, 'utf-8');
  const snapshot = JSON.parse(raw);
  snapshot.__path = snapshotPath;
  return snapshot;
}

async function copySpecContents(stagingDir) {
  const entries = [
    { source: 'tooling', target: 'tooling' },
    { source: path.join('tests', 'spec'), target: path.join('tests', 'spec') },
    {
      source: path.join('tests', 'conformance'),
      target: path.join('tests', 'conformance'),
    },
    { source: 'schemas', target: 'schemas' },
  ];

  for (const entry of entries) {
    const from = path.join(repoRoot, entry.source);
    const to = path.join(stagingDir, entry.target);
    await fs.mkdir(path.dirname(to), { recursive: true });
    await fs.cp(from, to, { recursive: true });
  }
}

async function copyResolverWorkspace(stagingDir, resolverRoot) {
  const resolverTarget = path.join(stagingDir, 'resolver');
  await fs.mkdir(resolverTarget, { recursive: true });

  const entries = [
    {
      from: path.join(resolverRoot, 'workspace.lcp.toml'),
      to: path.join(resolverTarget, 'workspace.lcp.toml'),
    },
    {
      from: path.join(resolverRoot, 'packages', 'resolver'),
      to: path.join(resolverTarget, 'packages', 'resolver'),
    },
    {
      from: path.join(resolverRoot, 'packages', 'resolver'),
      to: path.join(stagingDir, 'packages', 'resolver'),
    },
  ];

  for (const entry of entries) {
    await fs.mkdir(path.dirname(entry.to), { recursive: true });
    await fs.cp(entry.from, entry.to, { recursive: true });
  }
}

async function copyResolverSnapshot(stagingDir, snapshot) {
  const targetDir = path.join(stagingDir, 'metadata');
  await fs.mkdir(targetDir, { recursive: true });
  const targetPath = path.join(targetDir, 'lcod-resolver-runtime.json');
  const { __path, ...data } = snapshot;
  await fs.writeFile(targetPath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

async function writeManifest(stagingDir, context) {
  const { label, specVersion, specCommit, resolverSnapshot } = context;
  const manifest = {
    schemaVersion: '1.0',
    label,
    generatedAt: new Date().toISOString(),
    spec: {
      version: specVersion,
      commit: specCommit,
    },
    resolver: {
      commit: resolverSnapshot.commit ?? null,
      ref: resolverSnapshot.ref ?? null,
      snapshot: 'metadata/lcod-resolver-runtime.json',
    },
    contents: [
      {
        path: 'tooling',
        description: 'Spec helper components (resolver/registry/compose)',
      },
      { path: 'tests/spec', description: 'Shared spec fixtures' },
      {
        path: 'tests/conformance',
        description: 'Cross-runtime conformance manifest and helpers',
      },
      { path: 'schemas', description: 'Public schemas referenced by helper components' },
      {
        path: 'resolver',
        description: 'Resolver workspace (packages/resolver + workspace manifest)',
      },
      {
        path: 'packages',
        description: 'Resolver components mirrored at the root for runtime access',
      },
      {
        path: 'metadata/lcod-resolver-runtime.json',
        description: 'Resolver component snapshot (see resolver repo)',
      },
    ],
  };

  const manifestPath = path.join(stagingDir, 'manifest.json');
  await fs.writeFile(
    manifestPath,
    JSON.stringify(manifest, null, 2) + '\n',
    'utf-8'
  );
}

async function verifyRequiredFiles(stagingDir) {
  const required = [
    path.join(stagingDir, 'tooling', 'resolver', 'register_components', 'compose.yaml'),
    path.join(stagingDir, 'tooling', 'registry', 'catalog', 'compose.yaml'),
    path.join(stagingDir, 'metadata', 'lcod-resolver-runtime.json'),
    path.join(stagingDir, 'resolver', 'packages', 'resolver', 'compose.yaml'),
    path.join(stagingDir, 'manifest.json'),
  ];

  for (const filePath of required) {
    try {
      await fs.access(filePath);
    } catch (err) {
      throw new Error(
        `Runtime bundle is missing required file: ${path.relative(
          stagingDir,
          filePath
        )}`
      );
    }
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.stack || err.message : err);
  process.exitCode = 1;
});
