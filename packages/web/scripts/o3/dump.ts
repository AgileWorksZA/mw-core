#!/usr/bin/env ts-node
/**
 * dumpRepo.ts
 *
 * Creates repo_dump.json with the structure:
 * {
 *   files: [ { path, content } ],
 *   prompt: "instructions → paste back modified JSON only"
 * }
 *
 * Usage:  npx ts-node dumpRepo.ts
 *
 * Requires:  npm i -D ignore
 */

import * as fs from 'fs';
import * as path from 'path';
import ignore from 'ignore';

const repoRoot = process.cwd();
const ig = ignore();

// Load .gitignore and .aiignore if present
['.gitignore', '.aiignore'].forEach(file => {
  const fp = path.join(repoRoot, file);
  if (fs.existsSync(fp)) ig.add(fs.readFileSync(fp, 'utf8'));
});

// Recursively walk the tree, skipping ignored paths
function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const rel = path.relative(repoRoot, path.join(dir, entry.name));
    if (ig.ignores(rel)) return [];
    const fp = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(fp) : [rel];
  });
}

const files = walk(repoRoot);

const dump = {
  files: files.map(p => ({
    path: p,
    content: fs.readFileSync(path.join(repoRoot, p), 'utf8'),
  })),
  prompt: `
You are a dev ai. The user has provided their repository dump as this JSON file.

**Your ONLY reply must be a JSON object of exactly the same shape:**

{
  "files": [
    { "path": "relative/path/to/file", "content": "new file contents" },
    { "path": "file/to/delete.ts",      "content": null                }
  ],
  "message": "Optional human‑readable summary of the changes you made"
}

Rules:
• List **only** files that are new, changed, or deleted.
• To delete a file, set "content" to null.
• Do NOT wrap the JSON in Markdown or add extra commentary.
`.trim()
};

fs.writeFileSync('repo_dump.json', JSON.stringify(dump, null, 2));
console.log('✅  Repository dumped → repo_dump.json');

