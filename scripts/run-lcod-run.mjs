#!/usr/bin/env node
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import { constants as fsConstants } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const specRoot = path.resolve(scriptDir, '..');

async function fileExists(candidate) {
  try {
    await fs.access(candidate, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function dirExists(candidate) {
  try {
    const stat = await fs.stat(candidate);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

function resolvePath(input) {
  if (!input) return null;
  return path.isAbsolute(input) ? input : path.resolve(process.cwd(), input);
}

async function locateKernelRepo() {
  const envKeys = ['RUST_KERNEL_PATH', 'LCOD_KERNEL_RS_PATH'];
  for (const key of envKeys) {
    const value = resolvePath(process.env[key]);
    if (value && (await dirExists(value))) {
      return value;
    }
  }
  const candidates = [
    path.resolve(specRoot, '../lcod-kernel-rs'),
    path.resolve(specRoot, '../../lcod-kernel-rs'),
    path.resolve(process.cwd(), '../lcod-kernel-rs'),
    path.resolve(process.cwd(), '../../lcod-kernel-rs')
  ];
  for (const candidate of candidates) {
    if (await dirExists(candidate)) {
      return candidate;
    }
  }
  return null;
}

async function collectSearchDirs(kernelRoot) {
  const dirs = new Set();
  const add = (candidate) => {
    if (!candidate) return;
    dirs.add(path.resolve(candidate));
  };

  const runRoot = resolvePath(process.env.LCOD_RUN_ROOT);
  if (runRoot) {
    add(runRoot);
    add(path.join(runRoot, 'bin'));
  }

  if (kernelRoot) {
    add(kernelRoot);
    add(path.join(kernelRoot, 'target', 'release'));
    add(path.join(kernelRoot, 'target', 'debug'));
    const triples = [
      'x86_64-pc-windows-msvc',
      'x86_64-pc-windows-gnu',
      'x86_64-unknown-linux-gnu',
      'aarch64-apple-darwin'
    ];
    for (const triple of triples) {
      add(path.join(kernelRoot, 'target', triple, 'release'));
      add(path.join(kernelRoot, 'target', triple, 'debug'));
    }
    try {
      const entries = await fs.readdir(kernelRoot, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        if (!entry.name.startsWith('lcod-run-')) continue;
        const releaseDir = path.join(kernelRoot, entry.name);
        add(releaseDir);
        add(path.join(releaseDir, 'bin'));
      }
    } catch {
      // ignore
    }
  }

  try {
    const runtimeRoot = path.join(specRoot, 'dist', 'runtime');
    const entries = await fs.readdir(runtimeRoot, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const dirPath = path.join(runtimeRoot, entry.name);
      add(dirPath);
      add(path.join(dirPath, 'bin'));
    }
  } catch {
    // ignore
  }

  return Array.from(dirs);
}

async function resolveCargoBinary() {
  const override = resolvePath(process.env.CARGO_BIN);
  if (override && (await fileExists(override))) {
    return override;
  }
  const cargoName = process.platform === 'win32' ? 'cargo.exe' : 'cargo';
  const candidates = [];
  const cargoHome = resolvePath(process.env.CARGO_HOME);
  if (cargoHome) {
    candidates.push(path.join(cargoHome, 'bin', cargoName));
  }
  const rustupHome = resolvePath(process.env.RUSTUP_HOME);
  if (rustupHome) {
    candidates.push(path.join(rustupHome, 'bin', cargoName));
  }
  const homeDir = resolvePath(process.env.HOME) || resolvePath(process.env.USERPROFILE);
  if (homeDir) {
    candidates.push(path.join(homeDir, '.cargo', 'bin', cargoName));
  }
  for (const candidate of candidates) {
    if (candidate && (await fileExists(candidate))) {
      return candidate;
    }
  }
  return cargoName;
}

async function resolveBinary() {
  const override = resolvePath(process.env.LCOD_RUN_BIN);
  if (override) {
    if (await fileExists(override)) {
      return { binary: override, kernelRoot: null };
    }
    throw new Error(`LCOD_RUN_BIN points to ${override}, but the file does not exist.`);
  }

  const kernelRoot = await locateKernelRepo();
  const searchDirs = await collectSearchDirs(kernelRoot);
  const binaryNames = process.platform === 'win32' ? ['lcod-run.exe'] : ['lcod-run'];

  for (const dir of searchDirs) {
    for (const name of binaryNames) {
      const candidate = path.join(dir, name);
      if (await fileExists(candidate)) {
        return { binary: candidate, kernelRoot };
      }
    }
  }

  return { binary: null, kernelRoot };
}

function runProcess(command, args, options) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit', ...options });
    child.on('error', reject);
    child.on('exit', (code, signal) => {
      if (signal) {
        reject(new Error(`Process terminated with signal ${signal}`));
        return;
      }
      resolve(code ?? 0);
    });
  });
}

async function runViaCargo(kernelRoot, args, env) {
  if (!kernelRoot) {
    throw new Error(
      'Unable to locate lcod-kernel-rs repository. Set RUST_KERNEL_PATH or LCOD_RUN_BIN to a valid binary.'
    );
  }
  if (process.platform === 'win32' && process.env.LCOD_RUN_ALLOW_CARGO !== '1') {
    throw new Error(
      [
        'lcod-run executable not found.',
        'Download the Windows bundle and point LCOD_RUN_BIN to lcod-run.exe,',
        'or set LCOD_RUN_ALLOW_CARGO=1 to build from source with the required toolchain.'
      ].join(' ')
    );
  }
  const manifestPath = path.join(kernelRoot, 'Cargo.toml');
  if (!(await fileExists(manifestPath))) {
    throw new Error(`Cargo manifest not found at ${manifestPath}.`);
  }
  const cargoArgs = ['run'];
  if (process.env.LCOD_RUN_RELEASE === '1') {
    cargoArgs.push('--release');
  }
  cargoArgs.push('--quiet');
  cargoArgs.push('--manifest-path', manifestPath);
  cargoArgs.push('--bin', 'lcod_run');
  cargoArgs.push('--');
  cargoArgs.push(...args);
  const cargoCmd = await resolveCargoBinary();
  return runProcess(cargoCmd, cargoArgs, { cwd: process.cwd(), env });
}

async function main() {
  const args = process.argv.slice(2);
  const env = { ...process.env };
  if (!env.SPEC_REPO_PATH) {
    env.SPEC_REPO_PATH = specRoot;
  }

  const { binary, kernelRoot } = await resolveBinary();
  try {
    const exitCode = binary
      ? await runProcess(binary, args, { cwd: process.cwd(), env })
      : await runViaCargo(kernelRoot, args, env);
    process.exit(exitCode);
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
}

main();
