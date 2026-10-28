#!/usr/bin/env node
// Build the MCP server for MCPize and stage it at the image root.
//
// MCPize's generated Dockerfile for `runtime: typescript` is single-package and
// hard-codes the layout:
//
//   builder:  COPY package*.json ./  ->  RUN <build.install>  ->  COPY . .  ->  RUN <build.command>
//   runtime:  COPY --from=builder /app/package*.json ./  ->  /app/node_modules  ->  /app/dist
//
// This repository is a monorepo: the server lives in server/ and compiles to
// server/dist. The runtime stage only picks up /app/dist and /app/node_modules,
// so the build has to move them up — and replace the root package.json with the
// server's, which carries "type": "module"; the skill CLI manifest does not, and
// the compiled ESM would refuse to load under it.
//
// The uploaded tree also carries server/node_modules, because MCPize's tarball
// filter compares "/"-separated patterns against "\"-separated relative paths on
// Windows, so only top-level directory names are excluded. Those modules were
// installed on another platform and their .bin shims have no execute bit on
// Linux (`sh: tsc: Permission denied`), so the image build discards them and
// installs from server/package-lock.json instead.
//
// `mcpize deploy` also runs build.command in the working tree for its local build
// check, where staging would clobber the repository's own package.json and
// node_modules. The tarball always excludes .git, so its presence means this is a
// real checkout and only the server build runs.

import { execSync } from 'node:child_process';
import { cpSync, existsSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const serverDir = join(root, 'server');
const inImage = !existsSync(join(root, '.git'));

// execSync rather than execFileSync: Node refuses to spawn npm.cmd without a
// shell on Windows. Both cmd.exe and /bin/sh handle a plain command string.
const run = command => execSync(command, { cwd: root, stdio: 'inherit' });

if (inImage) {
  console.log('[mcpize-build] image build — discarding the uploaded node_modules.');
  rmSync(join(serverDir, 'node_modules'), { recursive: true, force: true });
  run('npm --prefix server ci --no-audit --no-fund');
}

run('npm --prefix server run build');

if (!inImage) {
  console.log('[mcpize-build] local checkout — server built, image staging skipped.');
  process.exit(0);
}

for (const [label, dir] of [
  ['server/dist', join(serverDir, 'dist')],
  ['server/node_modules', join(serverDir, 'node_modules')],
]) {
  if (!existsSync(dir)) {
    console.error(`[mcpize-build] missing ${label} — the server build did not produce it.`);
    process.exit(1);
  }
}

for (const file of ['package.json', 'package-lock.json']) {
  const source = join(serverDir, file);
  if (existsSync(source)) cpSync(source, join(root, file));
}

rmSync(join(root, 'dist'), { recursive: true, force: true });
rmSync(join(root, 'node_modules'), { recursive: true, force: true });
// Copy rather than rename: BuildKit's overlay reports EXDEV for a directory
// rename between these paths even though they sit in the same tree.
cpSync(join(serverDir, 'dist'), join(root, 'dist'), { recursive: true });
cpSync(join(serverDir, 'node_modules'), join(root, 'node_modules'), { recursive: true });

if (!existsSync(join(root, 'dist', 'http.js'))) {
  console.error('[mcpize-build] dist/http.js was not emitted — check server/tsconfig.json.');
  process.exit(1);
}
if (!existsSync(join(root, 'dist', 'skills'))) {
  console.error('[mcpize-build] dist/skills is missing — server/scripts/copy-skills.mjs did not run.');
  process.exit(1);
}
if (JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).type !== 'module') {
  console.error('[mcpize-build] root package.json is not the server manifest ("type": "module" missing).');
  process.exit(1);
}

console.log('[mcpize-build] staged dist/ and node_modules/ at the image root.');
