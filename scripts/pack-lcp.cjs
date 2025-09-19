#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const tar = require('tar');

function usage() {
  console.error('Usage: node scripts/pack-lcp.cjs path/to/component [output.lcpkg]');
  process.exit(2);
}

const input = process.argv[2];
if (!input) usage();
const outputArg = process.argv[3];
const componentDir = path.resolve(process.cwd(), input);
if (!fs.existsSync(componentDir) || !fs.statSync(componentDir).isDirectory()) {
  console.error(`Component directory not found: ${componentDir}`);
  process.exit(1);
}

const descriptor = path.join(componentDir, 'lcp.toml');
if (!fs.existsSync(descriptor)) {
  console.error('Missing lcp.toml in component directory');
  process.exit(1);
}

const outPath = outputArg
  ? path.resolve(process.cwd(), outputArg)
  : path.join(path.dirname(componentDir), `${path.basename(componentDir)}.lcpkg`);

async function main() {
  await tar.create({
    cwd: componentDir,
    file: outPath
  }, fs.readdirSync(componentDir));
  console.log(`Packaged ${componentDir} -> ${outPath}`);
}

main().catch(err => {
  console.error(err.stack || err.message);
  process.exit(1);
});
