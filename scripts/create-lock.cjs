#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const TOML = require('@iarna/toml');

function usage() {
  console.error('Usage: node scripts/create-lock.cjs path/to/lcp.toml [output]');
  process.exit(2);
}

const input = process.argv[2];
if (!input) usage();
const outputArg = process.argv[3];
const inputPath = path.resolve(process.cwd(), input);
if (!fs.existsSync(inputPath)) {
  console.error(`Cannot find ${inputPath}`);
  process.exit(1);
}

const rootDir = path.dirname(inputPath);
const outPath = outputArg
  ? path.resolve(process.cwd(), outputArg)
  : path.join(rootDir, 'lcp.lock');

const lcp = TOML.parse(fs.readFileSync(inputPath, 'utf8'));
if (!lcp.id) {
  console.error('Descriptor is missing an id');
  process.exit(1);
}

const lock = {
  schemaVersion: '1.0',
  resolverVersion: '0.1.0',
  components: []
};

const component = {
  id: lcp.id,
  resolved: lcp.id,
  source: { type: 'path', path: '.' }
};

const deps = Array.isArray(lcp?.deps?.requires) ? lcp.deps.requires : [];
if (deps.length) {
  component.dependencies = deps.map(dep => ({ id: dep, requested: dep }));
}

lock.components.push(component);

const tomlText = TOML.stringify(lock);
fs.writeFileSync(outPath, tomlText);
console.log(`Wrote lockfile to ${outPath}`);
