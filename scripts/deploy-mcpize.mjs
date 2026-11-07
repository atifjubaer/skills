// Deploy to MCPize from Windows.
//
// MCPize's CLI builds its upload exclusion list from forward-slash paths:
//
//   const p = path.relative(cwd, file);   // "servers\x\node_modules\y\index.js"
//   p.split('/')                          // ONE segment — no pattern matches
//   segments.includes('node_modules')     // false
//
// On Windows every relative path comes back with backslashes, so nothing is
// ever excluded — not node_modules, not .git, not dist. All 122 MB of
// node_modules ships, gzips to ~28 MB, and the upload dies with
// `Request failed: 546`. `.mcpizeignore` cannot help: it feeds the same
// matcher, so it also silently excludes nothing.
//
// This script takes those trees out of the working directory for the duration
// of the upload and puts them back afterwards, whether the deploy succeeds,
// fails, or is interrupted. Removing `.git` has a second effect that is
// required, not incidental: scripts/build-for-mcpize.mjs only runs its image
// branch (npm ci, staging dist/ and node_modules/ at the image root) when the
// checkout has no `.git`. Leave it in place and the image is built with no
// dependencies installed.
//
// Usage:
//   node scripts/deploy-mcpize.mjs             deploy
//   node scripts/deploy-mcpize.mjs --dry-run   report what would move, move nothing
//
// Link a different server first if you want the deploy to land somewhere other
// than the currently linked one:
//   npx mcpize link --server <server-id> --force
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const stashRoot = path.join(path.dirname(repoRoot), '.mcpize-stash');
const dryRun = process.argv.includes('--dry-run');

/** Directories that must not be in the upload. Each is stashed and restored. */
const STASH = [
  '.git',
  'servers/fluentcart-developer/node_modules',
  'servers/lemonsqueezy-developer/node_modules'
];

const moved = [];

const dirSize = dir => {
  try {
    const out = execSync(`du -sh "${dir}" 2>/dev/null`, { encoding: 'utf8' });
    return out.split(/\s/)[0];
  } catch {
    return '?';
  }
};

function restore() {
  while (moved.length > 0) {
    const { from, to } = moved.pop();
    try {
      if (!fs.existsSync(to)) continue;

      if (fs.existsSync(from)) {
        // The deploy rebuilt this directory while it was stashed — the image
        // build check runs `npm ci` in the same checkout. Renaming onto a
        // populated directory would nest the stash inside it instead of
        // restoring it (that is how a `node_modules/.mcpize-stash` copy once
        // appeared), so keep both and say so loudly rather than merge silently.
        const entries = fs.readdirSync(from);
        if (entries.length > 0) {
          console.error(
            `[restore] LEFT IN STASH: ${path.relative(repoRoot, from)} already exists and is populated.\n` +
              `          the stashed copy is at ${to}\n` +
              `          compare and merge manually, then remove the stash`
          );
          process.exitCode = 1;
          continue;
        }
        fs.rmdirSync(from);
      }

      fs.renameSync(to, from);
      console.log(`[restore] ${path.relative(repoRoot, from) || from}`);
    } catch (error) {
      console.error(`[restore] FAILED for ${to} -> ${from}: ${error.message}`);
      console.error(`[restore] your files are at ${to} — move them back manually`);
      process.exitCode = 1;
    }
  }
  try {
    if (fs.existsSync(stashRoot) && fs.readdirSync(stashRoot).length === 0) {
      fs.rmdirSync(stashRoot);
    }
  } catch {
    // leave an empty stash dir behind rather than fail the deploy
  }
}

// A signal handler plus finally covers ctrl-C, a thrown error, and a clean exit.
for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
  process.on(signal, () => {
    console.log(`\n[deploy] ${signal} — restoring before exit`);
    restore();
    process.exit(130);
  });
}

console.log(`[deploy] repo: ${repoRoot}`);
console.log(`[deploy] before: ${dirSize(repoRoot)}`);

if (dryRun) {
  for (const rel of STASH) {
    const from = path.join(repoRoot, rel);
    console.log(
      fs.existsSync(from)
        ? `[dry-run] would stash ${rel} (${dirSize(from)})`
        : `[dry-run] skip ${rel} — not present`
    );
  }
  process.exit(0);
}

fs.mkdirSync(stashRoot, { recursive: true });

try {
  for (const rel of STASH) {
    const from = path.join(repoRoot, rel);
    if (!fs.existsSync(from)) {
      console.log(`[stash] skip ${rel} — not present`);
      continue;
    }
    const to = path.join(stashRoot, rel.replace(/[\\/]/g, '__'));
    fs.renameSync(from, to);
    moved.push({ from, to });
    console.log(`[stash] ${rel} (${dirSize(to)})`);
  }

  console.log(`[deploy] after:  ${dirSize(repoRoot)}`);
  console.log('[deploy] running mcpize deploy…\n');

  execSync('npx -y mcpize deploy -y --skip-wizard', {
    cwd: repoRoot,
    stdio: 'inherit'
  });
} catch (error) {
  // execSync throws on a non-zero exit; the finally below still restores.
  console.error(`\n[deploy] deploy exited with an error: ${error.message}`);
  process.exitCode = 1;
} finally {
  console.log('');
  restore();
  console.log(`[deploy] after restore: ${dirSize(repoRoot)}`);
}
