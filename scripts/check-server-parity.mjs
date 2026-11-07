// Guards the duplicated transport core.
//
// Each server package is standalone by design, so ~400 lines of plumbing exist
// twice. That duplication has one characteristic failure mode: a change lands
// in one package and not the other, or a file copied from the retired suite
// keeps its old identity. Both happened — `http.ts` reported `fastr-dev-suite`
// from both packages and advertised both cards, and no verifier saw it because
// the stdio probe never loads that module.
//
// The files split into two kinds, so there are two kinds of check:
//
//   1. STRICT   — files with no legitimate reason to differ. Any divergence is
//                 a bug in one of the two copies.
//   2. IDENTITY — files that must differ, but only by the package's own name
//                 and card. Asserted by presence and absence rather than by
//                 diff against a baseline, so a legitimate structural change
//                 there needs no fixture update.
//
// Run from the repo root: node scripts/check-server-parity.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const serversRoot = path.join(root, 'servers');

const PACKAGES = [
  { pkg: 'fluentcart-developer', card: 'fluentcart' },
  { pkg: 'lemonsqueezy-developer', card: 'lemonsqueezy' }
];

/** Byte-identical in every package. Nothing in here knows which server it is. */
const STRICT = ['paths.ts', 'reference-reader.ts', 'index.ts'];

/** The old suite's identity. It must not come back in either package. */
const RETIRED = ['fastr-dev-suite', 'fastr-mcp-suite', 'Fastr MCP Suite'];

const failures = [];
const pass = msg => console.log(`PASS  ${msg}`);
const fail = msg => {
  failures.push(msg);
  console.log(`FAIL  ${msg}`);
};

const normalise = file =>
  fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');

const srcDir = p => path.join(serversRoot, p.pkg, 'src');

// ------------------------------------------------------------------ 1. strict
for (const file of STRICT) {
  const [a, b] = PACKAGES;
  const left = normalise(path.join(srcDir(a), file));
  const right = normalise(path.join(srcDir(b), file));

  if (left === right) {
    pass(`identical: ${file}`);
    continue;
  }

  const leftLines = left.split('\n');
  const rightLines = right.split('\n');
  const firstDiff = leftLines.findIndex((line, i) => line !== rightLines[i]);
  fail(
    `drifted: ${file} — ${a.pkg} and ${b.pkg} diverge at line ${firstDiff + 1}\n` +
      `        ${a.pkg}: ${leftLines[firstDiff] ?? '<end of file>'}\n` +
      `        ${b.pkg}: ${rightLines[firstDiff] ?? '<end of file>'}`
  );
}

// ---------------------------------------------------------------- 2. identity
for (const self of PACKAGES) {
  const other = PACKAGES.find(p => p.pkg !== self.pkg);

  const read = file => {
    const full = path.join(srcDir(self), file);
    return fs.existsSync(full) ? normalise(full) : null;
  };

  // http.ts is the file that shipped wrong. It must name this package and this
  // card, and must not know the other package exists.
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
    !http.includes(other.pkg)
      ? pass(`${self.pkg}: http.ts does not mention ${other.pkg}`)
      : fail(`${self.pkg}: http.ts mentions ${other.pkg} — a server must not advertise another package`);
    !http.includes(`'${other.card}'`)
      ? pass(`${self.pkg}: http.ts does not mention the ${other.card} card`)
      : fail(`${self.pkg}: http.ts mentions the ${other.card} card`);
  }

  // auth.ts and server.ts carry the card too, one as a type, one as a name.
  const auth = read('auth.ts');
  if (!auth) {
    fail(`${self.pkg}: src/auth.ts is missing`);
  } else {
    auth.includes(`'${self.card}'`)
      ? pass(`${self.pkg}: auth.ts is scoped to ${self.card}`)
      : fail(`${self.pkg}: auth.ts is not scoped to ${self.card}`);
    !auth.includes(`'${other.card}'`)
      ? pass(`${self.pkg}: auth.ts excludes ${other.card}`)
      : fail(`${self.pkg}: auth.ts still lists the ${other.card} card`);
  }

  const server = read('server.ts');
  if (!server) {
    fail(`${self.pkg}: src/server.ts is missing`);
  } else {
    server.includes(`name: '${self.pkg}'`)
      ? pass(`${self.pkg}: server.ts registers under its own name`)
      : fail(`${self.pkg}: server.ts does not register under '${self.pkg}'`);
    !server.includes(`'${other.card}'`)
      ? pass(`${self.pkg}: server.ts registers no ${other.card} tools`)
      : fail(`${self.pkg}: server.ts still references the ${other.card} card`);
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

// ------------------------------------------------------------- 3. retired names
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
  console.error(`\n${failures.length} parity problem(s) — the two servers share this core and must not drift apart silently.`);
  process.exit(1);
}

console.log('\nAll parity checks passed.');
