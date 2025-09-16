#!/usr/bin/env node
// Close GitHub issues corresponding to checked items in ROADMAP.md
// Usage: GH_TOKEN=... node scripts/close-roadmap-issues.mjs [OWNER REPO]

import fs from 'node:fs';
import path from 'node:path';

const GH_TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
if (!GH_TOKEN) {
  console.error('GH_TOKEN env var is required');
  process.exit(1);
}

const [ownerArg, repoArg] = process.argv.slice(2);
const DEFAULT_OWNER = 'lcod-team';
const DEFAULT_REPO = 'lcod-spec';
const owner = ownerArg || process.env.OWNER || DEFAULT_OWNER;
const repo = repoArg || process.env.REPO || DEFAULT_REPO;

const root = process.cwd();
const roadmapPath = path.join(root, 'ROADMAP.md');
const text = fs.readFileSync(roadmapPath, 'utf8');

// Extract checked items codes like M0-05, M1-02, etc.
const doneCodes = [];
for (const line of text.split(/\r?\n/)) {
  const m = line.match(/^\s*- \[x\]\s*(M\d+-\d+)\b/i);
  if (m) doneCodes.push(m[1].toUpperCase());
}

if (doneCodes.length === 0) {
  console.log('No checked items found in ROADMAP.md');
  process.exit(0);
}

const base = 'https://api.github.com';

async function gh(path, init = {}) {
  const res = await fetch(base + path, {
    ...init,
    headers: {
      'Authorization': `token ${GH_TOKEN}`,
      'Accept': 'application/vnd.github+json',
      'User-Agent': 'close-roadmap-issues-script',
      ...(init.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub ${res.status} ${res.statusText}: ${body}`);
  }
  return res.json();
}

async function main() {
  const issues = await gh(`/repos/${owner}/${repo}/issues?state=open&per_page=100`);
  let closed = 0;
  for (const code of doneCodes) {
    const match = issues.find(i => {
      const t = i.title || '';
      return t.startsWith(`${code} `) || t.startsWith(`${code} —`);
    });
    if (!match) {
      console.log(`No open issue found for ${code}`);
      continue;
    }
    await gh(`/repos/${owner}/${repo}/issues/${match.number}`, {
      method: 'PATCH',
      body: JSON.stringify({ state: 'closed' }),
    });
    closed++;
    console.log(`Closed #${match.number} for ${code}`);
  }
  console.log(`Done. Closed ${closed} issue(s).`);
}

main().catch(err => {
  console.error(err.stack || err.message || String(err));
  process.exit(1);
});

