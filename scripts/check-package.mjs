// Guards the published tarball.
//
// The root package is MIT and public. `server/` is BSL-1.1 commercial code and
// must never end up in it — and neither should a second product's skill. Both
// are one forgotten `files` entry away from shipping.
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const raw = execSync('npm pack --dry-run --json', { cwd: root, encoding: 'utf8' });
const [pkg] = JSON.parse(raw);
const shipped = pkg.files.map(f => f.path.replace(/\\/g, '/'));

const errors = [];

const forbidden = [
  {
    matches: p => p.startsWith('server/'),
    why: 'server/ is BSL-1.1 commercial code and must not ship in the public MIT package'
  },
  {
    matches: p => p.startsWith('skills/') && !p.startsWith('skills/fluentcart-developer/'),
    why: 'only skills/fluentcart-developer/ belongs to this package; other skills are separate products'
  },
  {
    matches: p => p.startsWith('node_modules/') || p.includes('/dist/'),
    why: 'build artifacts and dependencies must not ship'
  }
];

for (const file of shipped) {
  for (const rule of forbidden) {
    if (rule.matches(file)) errors.push(`${file}: ${rule.why}`);
  }
}

const required = ['package.json', 'bin/index.js', 'SKILL.md', 'skills/fluentcart-developer/SKILL.md'];
for (const file of required) {
  if (!shipped.includes(file)) errors.push(`${file}: required file is missing from the package`);
}

console.log(`Package ${pkg.name}@${pkg.version}: ${shipped.length} files, ${(pkg.size / 1024).toFixed(0)} kB packed`);

if (errors.length > 0) {
  for (const message of errors) console.error(`FAIL  ${message}`);
  console.error(`\n${errors.length} package error(s) — fix "files" in package.json`);
  process.exit(1);
}

console.log('Package contents ok');
