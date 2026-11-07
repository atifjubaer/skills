// Guards the two published server manifests.
//
// This used to check the root package's tarball, when the root package was
// `fluentcart-developer` and shipped a single skill. The root is now private
// and publishes nothing, so the check was rewritten against the two packages
// that do publish.
//
// It is deliberately static: it reads package.json and never builds. The
// realistic mistake is someone widening `files` and quietly shipping
// node_modules or the other product's skill into a tarball, and that is
// visible in the manifest. Content correctness is the verifier's job — it
// boots the built server and asserts the bundled skill loads over MCP.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const serversRoot = path.join(root, 'servers');

const PACKAGES = [
  { pkg: 'fluentcart-developer', skill: 'fluentcart-developer' },
  { pkg: 'lemonsqueezy-developer', skill: 'lemonsqueezy-developer' }
];

/** Everything a tarball may contain. Anything else is a mistake. */
const ALLOWED_FILES = ['dist', 'README.md', 'LICENSE.md', 'package.json'];

const errors = [];
const fail = message => {
  errors.push(message);
  console.error(`FAIL  ${message}`);
};

for (const { pkg, skill } of PACKAGES) {
  const dir = path.join(serversRoot, pkg);
  const manifestPath = path.join(dir, 'package.json');

  if (!fs.existsSync(manifestPath)) {
    fail(`${pkg}: package.json is missing`);
    continue;
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const where = `servers/${pkg}/package.json`;

  if (manifest.name !== pkg) {
    fail(`${where}: name is "${manifest.name}", expected "${pkg}"`);
  }

  if (manifest.private === true) {
    fail(`${where}: marked private, so it can never be published`);
  }

  // A widened `files` list is how node_modules or the other skill reaches npm.
  const files = manifest.files ?? [];
  const extra = files.filter(f => !ALLOWED_FILES.includes(f));
  if (extra.length > 0) {
    fail(`${where}: files contains ${extra.join(', ')} — allowed: ${ALLOWED_FILES.join(', ')}`);
  }

  for (const required of ['dist', 'README.md']) {
    if (!files.includes(required)) {
      fail(`${where}: files omits "${required}", so it will not ship`);
    }
  }

  // The bin is what `npx <pkg>` runs. It must exist and point into dist.
  const bin = manifest.bin?.[pkg];
  if (!bin) {
    fail(`${where}: no bin entry named "${pkg}", so npx cannot start it`);
  } else if (!bin.startsWith('dist/')) {
    fail(`${where}: bin points at "${bin}", which is not inside dist/`);
  }

  // A publish that skips the verifier is a publish that can ship a broken
  // server; prepublishOnly is the only thing standing in the way.
  const prepublish = manifest.scripts?.prepublishOnly ?? '';
  if (!prepublish.includes('verify')) {
    fail(`${where}: prepublishOnly does not run verify`);
  }

  // The bundled skill is copied from here at build time. If the source folder
  // is gone the build ships a server whose SKILL.md cannot be loaded.
  if (!fs.existsSync(path.join(root, 'skills', skill, 'SKILL.md'))) {
    fail(`skills/${skill}/SKILL.md is missing — ${pkg} would bundle a skillless server`);
  }

  console.log(`ok  ${pkg}@${manifest.version}  files: ${files.join(', ')}`);
}

if (errors.length > 0) {
  console.error(`\n${errors.length} manifest error(s)`);
  process.exit(1);
}

console.log('Server manifests ok');
