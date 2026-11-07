// Bundles this package's skill folder into `dist/skills` so the published npm
// package is self-contained (no dependency on the repo checkout).
//
// The build is **trimmed by default**: premium reference files are omitted
// unless FASTR_INCLUDE_PREMIUM=1. Those files document Fastr Devices for
// FluentCart and are the paid tier's content — they ship to MCPize, never to
// npm. See premium-references.json at the repo root for the list and the
// reasoning.
//
// Failing closed matters here: a missing premium-references.json is not an
// error, but it must never be read as "no files are premium". If the manifest
// is missing the build still runs, and the guard below makes that loud.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(serverRoot, '..', '..');
const source = path.resolve(repoRoot, 'skills', 'fluentcart-developer');
const targetRoot = path.resolve(serverRoot, 'dist', 'skills');
const target = path.join(targetRoot, 'fluentcart-developer');

const includePremium = process.env.FASTR_INCLUDE_PREMIUM === '1';

if (!fs.existsSync(path.join(source, 'SKILL.md'))) {
  console.error(`[copy-skills] Skill folder not found or missing SKILL.md: ${source}`);
  process.exit(1);
}

// ---------------------------------------------------------------- premium set
const manifestPath = path.join(repoRoot, 'premium-references.json');
let premium = new Set();

if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  premium = new Set(manifest.files ?? []);
} else if (!includePremium) {
  // Refuse to publish a build that cannot know what to withhold.
  console.error(
    `[copy-skills] premium-references.json not found at ${manifestPath}.\n` +
      `             The public build would ship every reference. Refusing.`
  );
  process.exit(1);
}

// ---------------------------------------------------------------- copy
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
let withheld = 0;

function copy(from, to, rel) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const relPath = rel ? path.join(rel, entry.name) : entry.name;
    const src = path.join(from, entry.name);
    const dst = path.join(to, entry.name);

    // Only references/ is filtered — SKILL.md and examples always ship.
    const inReferences = rel === 'references';
    if (inReferences && premium.has(entry.name) && !includePremium) {
      withheld++;
      continue;
    }

    if (entry.isDirectory()) {
      copy(src, dst, relPath);
    } else {
      fs.copyFileSync(src, dst);
      copied++;
    }
  }
}

copy(source, target, '');

if (withheld === 0 && !includePremium) {
  console.error(
    '[copy-skills] No premium files were withheld on a public build. Either the ' +
      'manifest lists names that no longer exist, or the skill folder is wrong. Refusing.'
  );
  process.exit(1);
}

console.log(
  `[copy-skills] Bundled fluentcart-developer: ${copied} file(s)` +
    (includePremium
      ? `, premium included (${premium.size} file(s) allowed)`
      : `, ${withheld} premium file(s) withheld`)
);
