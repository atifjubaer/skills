// Guards the published server's identity.
//
// This began as a parity check between two server packages that shared ~400
// lines of duplicated transport core. The second package was removed with the
// Lemon Squeezy skill, so there is nothing left to diff — but the failure mode
// the check existed for outlives the duplication:
//
//   - a file copied from the retired suite keeps its old identity, and
//   - a package advertises a card or a name that is not its own.
//
// Both happened once: `http.ts` reported `fastr-dev-suite` and advertised both
// cards, and no verifier saw it because the stdio probe never loads that module.
//
// So the cross-package diff is gone; the IDENTITY assertions and the
// retired-name scan remain. Run from the repo root:
//
//   node scripts/check-server-parity.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const serversRoot = path.join(root, 'servers');

const PACKAGES = [{ pkg: 'fluentcart-developer', card: 'fluentcart' }];

/** The old suite's identity. It must not come back. */
const RETIRED = ['fastr-dev-suite', 'fastr-mcp-suite', 'Fastr MCP Suite'];

const failures = [];
const pass = msg => console.log(`PASS  ${msg}`);
const fail = msg => {
  failures.push(msg);
  console.log(`FAIL  ${msg}`);
};

const normalise = file => fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');

const srcDir = p => path.join(serversRoot, p.pkg, 'src');

// ------------------------------------------------------------------ 1. identity
for (const self of PACKAGES) {
  const read = file => {
    const full = path.join(srcDir(self), file);
    return fs.existsSync(full) ? normalise(full) : null;
  };

  // http.ts is the file that shipped wrong. It must name this package and this
  // card, and must not know any other product exists.
  const http = read('http.ts');
  if (!http) {
    fail(`${self.pkg}: src/http.ts is missing`);
  } else {
    const wantName = `server: '${self.pkg}'`;
    const wantCard = `card: '${self.card}'`;
    http.includes(wantName)
      ? pass(`${self.pkg}: http.ts names itself`)
      : fail(`${self.pkg}: http.ts does not contain \`${wantName}\``);
    http.includes(wantCard)
      ? pass(`${self.pkg}: http.ts reports its own card`)
      : fail(`${self.pkg}: http.ts does not contain \`${wantCard}\``);
  }

  // auth.ts and server.ts carry the card too, one as a type, one as a name.
  const auth = read('auth.ts');
  if (!auth) {
    fail(`${self.pkg}: src/auth.ts is missing`);
  } else {
    auth.includes(`'${self.card}'`)
      ? pass(`${self.pkg}: auth.ts is scoped to ${self.card}`)
      : fail(`${self.pkg}: auth.ts is not scoped to ${self.card}`);
  }

  const server = read('server.ts');
  if (!server) {
    fail(`${self.pkg}: src/server.ts is missing`);
  } else {
    server.includes(`name: '${self.pkg}'`)
      ? pass(`${self.pkg}: server.ts registers under its own name`)
      : fail(`${self.pkg}: server.ts does not register under '${self.pkg}'`);
  }

  // The advertised version is a constant, not a read of package.json, so the
  // two can drift independently. `npm run verify` checks the compiled value;
  // this catches it before a build.
  const version = read('version.ts');
  const manifest = JSON.parse(normalise(path.join(serversRoot, self.pkg, 'package.json')));
  if (!version) {
    fail(`${self.pkg}: src/version.ts is missing`);
  } else {
    const match = version.match(/SERVER_VERSION = '([^']+)'/);
    if (!match) {
      fail(`${self.pkg}: SERVER_VERSION is not a string literal`);
    } else if (match[1] !== manifest.version) {
      fail(`${self.pkg}: SERVER_VERSION ${match[1]} != package.json ${manifest.version}`);
    } else {
      pass(`${self.pkg}: version constant matches package.json (${manifest.version})`);
    }
  }
}

// ------------------------------------------------------------- 2. retired names
for (const self of PACKAGES) {
  const dir = srcDir(self);
  const offenders = [];

  const walk = current => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      const text = normalise(full);
      for (const retired of RETIRED) {
        if (text.includes(retired)) {
          offenders.push(`${path.relative(root, full)} contains "${retired}"`);
        }
      }
    }
  };

  if (fs.existsSync(dir)) walk(dir);
  offenders.length === 0
    ? pass(`${self.pkg}: no retired suite identity`)
    : offenders.forEach(fail);
}

// ------------------------------------------------------------------- summary
if (failures.length > 0) {
  console.error(
    `\n${failures.length} identity problem(s) — a server must not drift from its own name or resurrect the retired suite's.`
  );
  process.exit(1);
}

console.log('\nAll identity checks passed.');
