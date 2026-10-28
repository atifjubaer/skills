// Bundles the Playing Card skill folders into `dist/skills` so the published
// npm package is self-contained (no dependency on the repo checkout).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(serverRoot, '..');
const sourceRoot = path.resolve(repoRoot, 'skills');
const targetRoot = path.resolve(serverRoot, 'dist', 'skills');

const CARDS = ['fluentcart-developer', 'lemonsqueezy-developer'];

if (!fs.existsSync(sourceRoot)) {
  console.error(`[copy-skills] Source skills folder not found: ${sourceRoot}`);
  process.exit(1);
}

let copied = 0;
for (const card of CARDS) {
  const src = path.join(sourceRoot, card);
  if (!fs.existsSync(src)) {
    console.warn(`[copy-skills] Skipping missing card: ${card}`);
    continue;
  }
  const dest = path.join(targetRoot, card);
  fs.rmSync(dest, { recursive: true, force: true });
  fs.cpSync(src, dest, { recursive: true });
  copied += 1;
}

console.log(`[copy-skills] Bundled ${copied} playing card(s) into ${targetRoot}`);
