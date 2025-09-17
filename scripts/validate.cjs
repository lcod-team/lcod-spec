#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

let TOML = null;
let AjvFactory = null;
let addFormats = null;
try { TOML = require('@iarna/toml'); }
catch (err) {
  console.error('ERROR: Missing dependency @iarna/toml. Run `npm install` before validating.');
  console.error(err.message);
  process.exit(1);
}
try {
  const AjvModule = require('ajv/dist/2020');
  AjvFactory = AjvModule.default || AjvModule;
  addFormats = require('ajv-formats');
}
catch (err) {
  console.error('ERROR: Missing Ajv dependencies. Run `npm install` before validating.');
  console.error(err.message);
  process.exit(1);
}

function read(file) { return fs.readFileSync(file, 'utf8'); }
function exists(p) { try { fs.accessSync(p); return true; } catch { return false; } }
function safeJsonParse(file) { try { JSON.parse(read(file)); return null; } catch (e) { return e.message; } }

function parseTomlMinimal(text) {
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
    const hash = val.indexOf('#');
    if (hash >= 0) val = val.slice(0, hash).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    } else if (val.startsWith('[') && val.endsWith(']')) {
      const inner = val.slice(1, -1).trim();
      const items = inner ? inner.split(',').map(s => s.trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '')) : [];
      val = items;
    } else if (/^\d+$/.test(val)) { val = parseInt(val, 10); }
    else if (val === 'true' || val === 'false') { val = val === 'true'; }
    if (section) data[section][key] = val; else data[key] = val;
  }
  return data;
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

(function main() {
  const repoRoot = path.resolve(__dirname, '..');
  const schemaRoot = path.join(repoRoot, 'schema');
  const examplesRoot = path.join(repoRoot, 'examples');
  let failed = 0; const issues = [];

  const lcpSchemaPath = path.join(schemaRoot, 'lcp.schema.json');
  if (!exists(lcpSchemaPath)) { issues.push('ERROR: Missing schema/lcp.schema.json'); failed++; }
  else { const err = safeJsonParse(lcpSchemaPath); if (err) { issues.push('ERROR: Invalid JSON at schema/lcp.schema.json: ' + err); failed++; } }

  let ajv = null; let lcpSchemaJson = null;
  let validateLcp = null;
  try {
    lcpSchemaJson = JSON.parse(read(lcpSchemaPath));
    ajv = new AjvFactory({
      strict: true,
      strictSchema: true,
      allErrors: true,
      allowUnionTypes: true
    });
    addFormats(ajv);
    validateLcp = ajv.compile(lcpSchemaJson);
  } catch (e) {
    issues.push('ERROR: Unable to compile LCP schema: ' + e.message);
    failed++;
  }

  for (const file of findLcpToml(examplesRoot)) {
    const dir = path.dirname(file);
    const rel = path.relative(repoRoot, file);
    let obj = null;
    try { const text = read(file); obj = TOML ? TOML.parse(text) : parseTomlMinimal(text); }
    catch (e) { issues.push(`ERROR: Cannot parse ${rel}: ${e.message}`); failed++; continue; }
    if (validateLcp) {
      const ok = validateLcp(obj);
      if (!ok) {
        failed++;
        const errs = (validateLcp.errors || []).map(e => `${e.instancePath || '/'} ${e.message}${e.params && e.params.allowedValues ? ` (allowed: ${e.params.allowedValues.join(', ')})` : ''}`).join('; ');
        issues.push(`ERROR: ${rel}: schema validation failed: ${errs}`);
      }
    }
    if (!obj.tool || !obj.tool.inputSchema || !obj.tool.outputSchema) { issues.push(`ERROR: ${rel}: missing tool.inputSchema or tool.outputSchema`); failed++; }
    else {
      for (const key of ['inputSchema', 'outputSchema']) {
        const p = path.join(dir, obj.tool[key]);
        const r = path.relative(repoRoot, p);
        if (!exists(p)) { issues.push(`ERROR: ${rel}: missing ${key} file ${r}`); failed++; }
        else { const err = safeJsonParse(p); if (err) { issues.push(`ERROR: ${r}: invalid JSON: ${err}`); failed++; } }
      }
    }
    const compose = path.join(dir, 'compose.json');
    if (exists(compose)) { const err = safeJsonParse(compose); if (err) { issues.push(`ERROR: ${path.relative(repoRoot, compose)} invalid JSON: ${err}`); failed++; } }

    if (obj.docs) {
      if (obj.docs.readme) { const p = path.join(dir, obj.docs.readme); if (!exists(p)) { issues.push(`ERROR: ${rel}: docs.readme not found: ${path.relative(repoRoot, p)}`); failed++; } }
      if (obj.docs.logo) { const p = path.join(dir, obj.docs.logo); if (!exists(p)) { issues.push(`ERROR: ${rel}: docs.logo not found: ${path.relative(repoRoot, p)}`); failed++; } }
    }
    if (obj.ui && obj.ui.propsSchema) {
      const p = path.join(dir, obj.ui.propsSchema);
      if (!exists(p)) { issues.push(`ERROR: ${rel}: ui.propsSchema not found: ${path.relative(repoRoot, p)}`); failed++; }
      else { const err = safeJsonParse(p); if (err) { issues.push(`ERROR: ${path.relative(repoRoot, p)} invalid JSON: ${err}`); failed++; } }
    }
  }

  if (issues.length) issues.forEach(m => console.error(m));
  const ok = failed === 0;
  console.log(ok ? 'OK: validation passed' : `FAIL: ${failed} issue(s)`);
  process.exit(ok ? 0 : 1);
})();
