// Bundles the skill folders into `dist/skills` so the published npm package is
// self-contained (no dependency on the repo checkout).
//
// The list is discovered, not typed: every folder under `skills/` that holds a
// SKILL.md ships. Adding a skill means dropping the folder in — there is no
// list here to forget to update.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(serverRoot, '..');
const sourceRoot = path.resolve(repoRoot, 'skills');
const targetRoot = path.resolve(serverRoot, 'dist', 'skills');

if (!fs.existsSync(sourceRoot)) {
  console.error(`[copy-skills] Source skills folder not found: ${sourceRoot}`);
  process.exit(1);
}

// statSync, not Dirent.isDirectory(): a symlinked skill folder counts too.
const skills = fs
  .readdirSync(sourceRoot)
  .filter((name) => {
    const dir = path.join(sourceRoot, name);
    return fs.statSync(dir, { throwIfNoEntry: false })?.isDirectory() && fs.existsSync(path.join(dir, 'SKILL.md'));
  })
  .sort();

if (skills.length === 0) {
  console.error(`[copy-skills] No skill folders (a directory holding SKILL.md) under ${sourceRoot}`);
  process.exit(1);
}

// Wipe first: a skill removed from `skills/` must not survive in dist/ from an
// earlier build.
fs.rmSync(targetRoot, { recursive: true, force: true });

for (const skill of skills) {
  fs.cpSync(path.join(sourceRoot, skill), path.join(targetRoot, skill), { recursive: true });
}

console.log(`[copy-skills] Bundled ${skills.length} skill(s) into ${targetRoot}: ${skills.join(', ')}`);
