#!/usr/bin/env node
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const execFileAsync = promisify(execFile);

const specRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const manifestPath = path.join(specRoot, 'tests/conformance/manifest.json');

async function locateRepo(envVar, candidates) {
  if (process.env[envVar]) {
    return path.resolve(process.env[envVar]);
  }
  for (const candidate of candidates) {
    const resolved = path.resolve(specRoot, candidate);
    try {
      const stat = await fs.stat(resolved);
      if (stat.isDirectory()) return resolved;
    } catch (_) {
      // ignore and continue
    }
  }
  throw new Error(`Unable to locate repository via ${envVar}. Provide an explicit path.`);
}

function parseJsonFromOutput(output) {
  const trimmed = output.trim();
  const startIdx = trimmed.indexOf('[');
  if (startIdx === -1) {
    throw new Error('Expected JSON array in process output');
  }
  return JSON.parse(trimmed.slice(startIdx));
}

function cleanValue(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => cleanValue(item))
      .filter((item) => item !== undefined);
  }
  if (value && typeof value === 'object') {
    const output = {};
    for (const [key, val] of Object.entries(value)) {
      if (['durationMs', 'metadata', 'mtime', 'id'].includes(key)) continue;
      if (key === 'stream') continue;
      const cleaned = cleanValue(val);
      if (cleaned === undefined) continue;
      if (key === 'messages' && Array.isArray(cleaned) && cleaned.length === 0) continue;
      output[key] = cleaned;
    }
    return output;
  }
  return value;
}

function normalise(value) {
  if (Array.isArray(value)) {
    return value.map((item) => normalise(item));
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, val]) => [key, normalise(val)]);
    return Object.fromEntries(entries);
  }
  return value;
}

function compareResults(nodeResults, rustResults) {
  const nodeMap = new Map(nodeResults.map((res) => [res.name, res]));
  const rustMap = new Map(rustResults.map((res) => [res.name, res]));
  const diffs = [];

  const allNames = new Set([...nodeMap.keys(), ...rustMap.keys()]);
  for (const name of allNames) {
    const node = nodeMap.get(name);
    const rust = rustMap.get(name);
    if (!node || !rust) {
      diffs.push({
        name,
        message: !node
          ? 'Missing result from Node runtime'
          : 'Missing result from Rust runtime'
      });
      continue;
    }
    if (node.success !== rust.success) {
      diffs.push({
        name,
        message: `Success mismatch (node=${node.success}, rust=${rust.success})`
      });
      continue;
    }
    if (!node.success) {
      // Both failed; include error messages for context
      const nodeErr = node.error?.message || node.report?.messages?.join('\n') || 'unknown';
      const rustErr = rust.error?.message || rust.report?.messages?.join('\n') || 'unknown';
      diffs.push({
        name,
        message: `Both runtimes failed (node=${nodeErr}, rust=${rustErr})`
      });
      continue;
    }
    const nodeResult = normalise(cleanValue(node.result ?? null));
    const rustResult = normalise(cleanValue(rust.result ?? null));
    if (JSON.stringify(nodeResult) !== JSON.stringify(rustResult)) {
      diffs.push({
        name,
        message: 'Result payload mismatch',
        node: nodeResult,
        rust: rustResult
      });
    }
  }

  return diffs;
}

(async () => {
  const manifestContent = await fs.readFile(manifestPath, 'utf8');
  const manifest = JSON.parse(manifestContent);
  if (!Array.isArray(manifest) || manifest.length === 0) {
    throw new Error('Conformance manifest is empty.');
  }

  const nodeRepo = await locateRepo('NODE_KERNEL_PATH', [
    '../lcod-kernel-js',
    '../../lcod-kernel-js'
  ]);
  const rustRepo = await locateRepo('RUST_KERNEL_PATH', [
    '../lcod-kernel-rs',
    '../../lcod-kernel-rs'
  ]);

  const envBase = { ...process.env, SPEC_REPO_PATH: specRoot };

  const { stdout: nodeStdout } = await execFileAsync(
    'node',
    ['scripts/run-spec-tests.mjs', '--json', '--manifest', manifestPath],
    { cwd: nodeRepo, env: envBase }
  );
  const nodeResults = parseJsonFromOutput(nodeStdout);

  // Build (quietly) before running to keep JSON clean
  await execFileAsync('cargo', ['build', '--quiet', '--bin', 'test_specs'], {
    cwd: rustRepo,
    env: envBase
  });

  const { stdout: rustStdout } = await execFileAsync(
    'cargo',
    ['run', '--quiet', '--bin', 'test_specs', '--', '--json', '--manifest', manifestPath],
    { cwd: rustRepo, env: envBase }
  );
  const rustResults = parseJsonFromOutput(rustStdout);

  const diffs = compareResults(nodeResults, rustResults);
  if (diffs.length === 0) {
    console.log(`✅ Conformance suite passed across ${manifest.length} test(s).`);
    process.exit(0);
  } else {
    console.error('❌ Conformance mismatches detected:');
    for (const diff of diffs) {
      console.error(`- ${diff.name}: ${diff.message}`);
      if (diff.node !== undefined || diff.rust !== undefined) {
        console.error(`  node: ${JSON.stringify(diff.node)}`);
        console.error(`  rust: ${JSON.stringify(diff.rust)}`);
      }
    }
    process.exit(1);
  }
})().catch((err) => {
  console.error(err.stack || err.message);
  process.exit(1);
});
