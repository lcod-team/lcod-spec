#!/usr/bin/env node
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const execFileAsync = promisify(execFile);

function escapeForDoubleQuotes(value) {
  return value.replace(/(["$`\\])/g, '\\$1');
}

async function runCommand(command, args, options = {}) {
  try {
    return await execFileAsync(command, args, options);
  } catch (err) {
    if (err && (err.stdout !== undefined || err.stderr !== undefined)) {
      return { stdout: err.stdout || '', stderr: err.stderr || '' };
    }
    throw err;
  }
}

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
  const endIdx = trimmed.lastIndexOf(']');
  if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) {
    throw new Error('Expected JSON array in process output');
  }
  return JSON.parse(trimmed.slice(startIdx, endIdx + 1));
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

function buildResultMap(results) {
  return new Map(results.map((res) => [res.name, res]));
}

function compareResults(resultSets) {
  if (resultSets.length <= 1) return [];
  const [baseline, ...others] = resultSets;
  const baselineMap = buildResultMap(baseline.results);
  const otherMaps = others.map((set) => ({
    runtime: set.runtime,
    map: buildResultMap(set.results)
  }));

  const testNames = new Set();
  for (const set of resultSets) {
    for (const res of set.results) {
      testNames.add(res.name);
    }
  }

  const diffs = [];
  for (const name of testNames) {
    const baseResult = baselineMap.get(name);
    if (!baseResult) {
      diffs.push({
        name,
        message: `Missing result from baseline runtime (${baseline.runtime})`
      });
      continue;
    }

    for (const { runtime, map } of otherMaps) {
      const otherResult = map.get(name);
      if (!otherResult) {
        diffs.push({
          name,
          message: `Missing result from runtime ${runtime}`
        });
        continue;
      }
      if (baseResult.success !== otherResult.success) {
        diffs.push({
          name,
          message: `Success mismatch (${baseline.runtime}=${baseResult.success}, ${runtime}=${otherResult.success})`
        });
        continue;
      }
      if (!baseResult.success) {
        const baseErr =
          baseResult.error?.message || baseResult.report?.messages?.join('\n') || 'unknown';
        const otherErr =
          otherResult.error?.message || otherResult.report?.messages?.join('\n') || 'unknown';
        diffs.push({
          name,
          message: `Both runtimes failed (${baseline.runtime}=${baseErr}, ${runtime}=${otherErr})`
        });
        continue;
      }
      const basePayload = normalise(cleanValue(baseResult.result ?? null));
      const otherPayload = normalise(cleanValue(otherResult.result ?? null));
      if (JSON.stringify(basePayload) !== JSON.stringify(otherPayload)) {
        diffs.push({
          name,
          message: `Result payload mismatch (${baseline.runtime} vs ${runtime})`,
          baseline: basePayload,
          other: otherPayload,
          otherRuntime: runtime
        });
      }
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
  const includeJava = ['1', 'true', 'yes'].includes(
    (process.env.INCLUDE_JAVA_RUNTIME || '').toLowerCase()
  );
  let javaRepo = null;
  if (includeJava) {
    javaRepo = await locateRepo('JAVA_KERNEL_PATH', [
      '../lcod-kernel-java',
      '../../lcod-kernel-java'
    ]);
    if (!javaRepo) {
      console.warn('⚠️  INCLUDE_JAVA_RUNTIME set but Java kernel repo not found. Skipping.');
    }
  }

  const envBase = { ...process.env, SPEC_REPO_PATH: specRoot };

  const runtimes = [
    {
      runtime: 'node',
      execute: async () => {
        const { stdout } = await execFileAsync(
          'node',
          ['scripts/run-spec-tests.mjs', '--json', '--manifest', manifestPath],
          { cwd: nodeRepo, env: envBase }
        );
        return parseJsonFromOutput(stdout);
      }
    },
    {
      runtime: 'rust',
      execute: async () => {
        await execFileAsync('cargo', ['build', '--quiet', '--bin', 'test_specs'], {
          cwd: rustRepo,
          env: envBase
        });
        const { stdout } = await execFileAsync(
          'cargo',
          ['run', '--quiet', '--bin', 'test_specs', '--', '--json', '--manifest', manifestPath],
          { cwd: rustRepo, env: envBase }
        );
        return parseJsonFromOutput(stdout);
      }
    },
    ...(includeJava && javaRepo
      ? [
          {
            runtime: 'java',
            execute: async () => {
              const gradleCmd = `./gradlew specTests -PspecArgs="--manifest ${escapeForDoubleQuotes(
                manifestPath
              )} --json"`;
              const { stdout } = await runCommand('bash', ['-lc', gradleCmd], {
                cwd: javaRepo,
                env: envBase
              });
              return parseJsonFromOutput(stdout);
            }
          }
        ]
      : [])
  ];

  const resultSets = [];
  for (const runner of runtimes) {
    const results = await runner.execute();
    resultSets.push({ runtime: runner.runtime, results });
  }

  const diffs = compareResults(resultSets);
  if (diffs.length === 0) {
    console.log(
      `✅ Conformance suite passed across ${manifest.length} test(s) on ${resultSets.length} runtime(s).`
    );
    process.exit(0);
  } else {
    console.error('❌ Conformance mismatches detected:');
    for (const diff of diffs) {
      console.error(`- ${diff.name}: ${diff.message}`);
      if (diff.baseline !== undefined || diff.other !== undefined) {
        console.error(`  ${runtimes[0].runtime}: ${JSON.stringify(diff.baseline)}`);
        console.error(`  ${diff.otherRuntime ?? 'other'}: ${JSON.stringify(diff.other)}`);
      }
    }
    process.exit(1);
  }
})().catch((err) => {
  console.error(err.stack || err.message);
  process.exit(1);
});
