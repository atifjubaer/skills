// Bundles this package's skill folder into `dist/skills` so the published npm
// package is self-contained (no dependency on the repo checkout).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(serverRoot, '..', '..');
const source = path.resolve(repoRoot, 'skills', 'lemonsqueezy-developer');
const targetRoot = path.resolve(serverRoot, 'dist', 'skills');

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

fs.cpSync(source, path.join(targetRoot, 'lemonsqueezy-developer'), { recursive: true, force: true });

const files = fs.readdirSync(path.join(targetRoot, 'lemonsqueezy-developer', 'references'), { recursive: true }).length;
console.log(`[copy-skills] Bundled lemonsqueezy-developer (${files} files) into dist/skills`);
