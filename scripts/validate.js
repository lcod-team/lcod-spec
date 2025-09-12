#!/usr/bin/env node
// Minimal M0 validator: checks examples lcp.toml references and JSON syntax
const fs = require('fs');
const path = require('path');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function exists(p) {
  try { fs.accessSync(p); return true; } catch { return false; }
}

function parseTomlMinimal(text) {
  // Very naive parser for simple key="value" and [section] blocks used here
  const data = {}; let section = null;
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const mSec = line.match(/^\[(.+)]\s*$/);
    if (mSec) { section = mSec[1]; if (!data[section]) data[section] = {}; continue; }
    const mKV = line.match(/^([A-Za-z0-9_.-]+)\s*=\s*(.+)$/);
    if (!mKV) continue;
    const key = mKV[1];
    let val = mKV[2].trim();
    // Strip comments at end of line
    const hash = val.indexOf('#');
    if (hash >= 0) val = val.slice(0, hash).trim();
    // Strings
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    } else if (val.startsWith('[') && val.endsWith(']')) {
      // very naive array of strings
      const inner = val.slice(1, -1).trim();
      const items = inner ? inner.split(',').map(s => s.trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '')) : [];
      val = items;
    } else if (/^\d+$/.test(val)) {
      val = parseInt(val, 10);
    } else if (val === 'true' || val === 'false') {
      val = val === 'true';
    }
    if (section) data[section][key] = val; else data[key] = val;
  }
  return data;
}

function validateId(id) {
  const re = /^lcod:\/\/[a-z0-9_-]+\/[a-z0-9_-]+@\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;
  return re.test(id);
}

function safeJsonParse(file) {
  try { JSON.parse(read(file)); return null; } catch (e) { return e.message; }
}

function* findLcpToml(root) {
  const stack = [root];
  while (stack.length) {
    const dir = stack.pop();
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, ent.name);
      if (ent.isDirectory()) stack.push(p);
      else if (ent.isFile() && ent.name === 'lcp.toml') yield p;
    }
  }
}

function main() {
  const repoRoot = path.resolve(__dirname, '..');
  const schemaRoot = path.join(repoRoot, 'schema');
  const examplesRoot = path.join(repoRoot, 'examples');

  let failed = 0;
  const issues = [];

  // Validate top-level LCP schema is valid JSON
  const lcpSchema = path.join(schemaRoot, 'lcp.schema.json');
  if (!exists(lcpSchema)) {
    issues.push(`ERROR: Missing schema/lcp.schema.json`);
    failed++;
  } else {
    const err = safeJsonParse(lcpSchema);
    if (err) { issues.push(`ERROR: Invalid JSON at schema/lcp.schema.json: ${err}`); failed++; }
  }

  // Validate examples
  for (const file of findLcpToml(examplesRoot)) {
    const dir = path.dirname(file);
    const rel = path.relative(repoRoot, file);
    let text = '';
    try { text = read(file); } catch (e) { issues.push(`ERROR: Cannot read ${rel}: ${e.message}`); failed++; continue; }
    const obj = parseTomlMinimal(text);
    if (!obj.id || !validateId(obj.id)) {
      issues.push(`ERROR: ${rel}: invalid or missing id`);
      failed++;
    }
    if (!obj.tool || !obj.tool.inputSchema || !obj.tool.outputSchema) {
      issues.push(`ERROR: ${rel}: missing tool.inputSchema or tool.outputSchema`);
      failed++;
    } else {
      for (const key of ['inputSchema', 'outputSchema']) {
        const p = path.join(dir, obj.tool[key]);
        const r = path.relative(repoRoot, p);
        if (!exists(p)) { issues.push(`ERROR: ${rel}: missing ${key} file ${r}`); failed++; }
        else { const err = safeJsonParse(p); if (err) { issues.push(`ERROR: ${r}: invalid JSON: ${err}`); failed++; } }
      }
    }
    // If compose.json exists, ensure valid JSON
    const compose = path.join(dir, 'compose.json');
    if (exists(compose)) { const err = safeJsonParse(compose); if (err) { issues.push(`ERROR: ${path.relative(repoRoot, compose)} invalid JSON: ${err}`); failed++; } }
  }

  if (issues.length) issues.forEach(m => console.error(m));
  const ok = failed === 0;
  console.log(ok ? 'OK: validation passed' : `FAIL: ${failed} issue(s)`);
  process.exit(ok ? 0 : 1);
}

main();

