#!/usr/bin/env node
// Keeps src/version.ts in step with package.json.
//
// The server advertises SERVER_VERSION from a compiled constant rather than by
// reading the manifest: dist/ is staged where package.json is not (a container
// image), and a failed read at startup would take the whole server down. The
// cost of that decision is that the two numbers can drift — and `npm run
// verify` fails when they do, which is exactly how the first release attempt
// was stopped after `npm version` moved the manifest to 3.0.1 while the built
// server still answered `/health` with 3.0.0.
//
// Wired as npm's `version` lifecycle script, so `npm version` updates both for
// a person on a laptop and for the release workflow, with no second command to
// remember.

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const file = join(root, 'src', 'version.ts');

const pattern = /export const SERVER_VERSION = '[^']*';/;
const source = readFileSync(file, 'utf8');

if (!pattern.test(source)) {
  console.error(`sync-version: no SERVER_VERSION declaration in ${file}`);
  process.exit(1);
}

const next = source.replace(pattern, `export const SERVER_VERSION = '${manifest.version}';`);

if (next !== source) {
  writeFileSync(file, next);
  console.log(`sync-version: src/version.ts -> ${manifest.version}`);
} else {
  console.log(`sync-version: src/version.ts already at ${manifest.version}`);
}
