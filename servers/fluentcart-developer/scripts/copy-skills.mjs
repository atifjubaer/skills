// Bundles this package's skill folder into `dist/skills` so the published npm
// package is self-contained (no dependency on the repo checkout).
//
// Everything in the skill folder ships. There used to be a premium tier here:
// five FastrSoft reference files were withheld from the npm build unless
// FASTR_INCLUDE_PREMIUM=1, so the public package and the MCPize build carried
// different corpora. That is gone — one corpus, the same files everywhere, no
// environment variable deciding what a user is allowed to read.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(serverRoot, '..', '..');
const source = path.resolve(repoRoot, 'skills', 'fluentcart-developer');
const targetRoot = path.resolve(serverRoot, 'dist', 'skills');
const target = path.join(targetRoot, 'fluentcart-developer');

if (!fs.existsSync(path.join(source, 'SKILL.md'))) {
  console.error(`[copy-skills] Skill folder not found or missing SKILL.md: ${source}`);
  process.exit(1);
}

// Wipe first: a reference removed from the skill must not survive in dist/ from
// an earlier build. On Windows a file can be locked (EPERM) even when the
// folder is writable, so fall back to overwriting in place.
try {
  fs.rmSync(targetRoot, { recursive: true, force: true });
} catch (error) {
  if (error.code !== 'EPERM') throw error;
  console.warn(`[copy-skills] Could not wipe ${targetRoot} (${error.code}); overwriting in place.`);
}

let copied = 0;

function copy(from, to, rel) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const relPath = rel ? path.join(rel, entry.name) : entry.name;
    const src = path.join(from, entry.name);
    const dst = path.join(to, entry.name);

    if (entry.isDirectory()) {
      copy(src, dst, relPath);
    } else {
      fs.copyFileSync(src, dst);
      copied++;
    }
  }
}

copy(source, target, '');

console.log(`[copy-skills] Bundled fluentcart-developer: ${copied} file(s)`);
