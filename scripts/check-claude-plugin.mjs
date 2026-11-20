// Guards the Claude Code plugin, which is deliberately tiny.
//
// The plugin used to be the repository root. That worked, and it cost every
// user 4 MB: installing a plugin copies its directory into
// `~/.claude/plugins/cache/`, so the whole documentation corpus was copied —
// and never read, because the tools fetch it from npm. The plugin is now a
// directory holding an identity file, an MCP declaration, and a README.
//
// Three things can go wrong with a wrapper this thin, and none of them are
// visible until a user installs it:
//
//   1. it drifts back to the root, or to a directory that exists but is not a
//      plugin, and every install silently copies megabytes again;
//   2. it names a package or a server that is not the one that ships;
//   3. its version falls behind the server's, and Claude Code — which re-copies
//      a plugin only when its version changes — stops delivering updates.
//
// Run from the repo root:
//
//   node scripts/check-claude-plugin.mjs
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const PLUGIN_DIR = 'plugins/claude-plugin-fluentcart'
const PLUGIN_NAME = 'fluentcart-developer'
const MARKETPLACE = '.claude-plugin/marketplace.json'
const SERVER_MANIFEST = 'servers/fluentcart-developer/package.json'
const SERVER_NAME = 'fluentcart'
const NPM_PACKAGE = 'fluentcart-developer'

// A wrapper that grows past this has stopped being a wrapper. The three files
// it ships are about 2 KB; the corpus it must never copy is 4 MB.
const SIZE_CEILING_BYTES = 64 * 1024

const failures = []
const pass = (msg) => console.log(`PASS  ${msg}`)
const fail = (msg) => {
  failures.push(msg)
  console.log(`FAIL  ${msg}`)
}

const readJson = (rel) => JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8'))
const exists = (rel) => fs.existsSync(path.join(root, rel))

/** Every file under `dir`, with its size, relative to it. */
function walk(rel, base = rel, found = []) {
  for (const entry of fs.readdirSync(path.join(root, rel), { withFileTypes: true })) {
    const relPath = path.posix.join(rel, entry.name)
    if (entry.isDirectory()) {
      walk(relPath, base, found)
    } else {
      found.push({ rel: path.posix.relative(base, relPath), bytes: fs.statSync(path.join(root, relPath)).size })
    }
  }
  return found
}

// ------------------------------------------------------- 1. the plugin exists
if (!exists(`${PLUGIN_DIR}/.claude-plugin/plugin.json`)) {
  fail(`${PLUGIN_DIR}/.claude-plugin/plugin.json is missing — the marketplace entry would point at nothing`)
} else {
  const manifest = readJson(`${PLUGIN_DIR}/.claude-plugin/plugin.json`)
  manifest.name === PLUGIN_NAME
    ? pass(`plugin names itself ${PLUGIN_NAME}`)
    : fail(`plugin.json name is "${manifest.name}", expected "${PLUGIN_NAME}"`)

  // Claude Code re-copies a plugin only when its computed version changes, and
  // the manifest's version wins. A stale number here freezes every user on the
  // copy they already have, however many releases ship to npm.
  const serverVersion = readJson(SERVER_MANIFEST).version
  manifest.version === serverVersion
    ? pass(`plugin version matches the server (${serverVersion})`)
    : fail(`plugin version ${manifest.version} != server ${serverVersion} — releases would not reach Claude Code users`)
}

// ------------------------------------------------------ 2. it stays a wrapper
if (!exists(PLUGIN_DIR)) {
  fail(`${PLUGIN_DIR} is missing`)
} else {
  const files = walk(PLUGIN_DIR)
  const total = files.reduce((n, f) => n + f.bytes, 0)

  total <= SIZE_CEILING_BYTES
    ? pass(`plugin directory is ${total} B across ${files.length} file(s)`)
    : fail(`${PLUGIN_DIR} is ${total} B — a wrapper must stay under ${SIZE_CEILING_BYTES} B, or installs copy the corpus again`)

  const corpus = files.filter((f) => f.rel.includes('references/'))
  corpus.length === 0
    ? pass('plugin ships no documentation pages')
    : fail(`${PLUGIN_DIR} ships ${corpus.length} reference page(s); they belong in the npm package only`)
}

// ------------------------------------------------ 3. it launches the real one
if (!exists(`${PLUGIN_DIR}/.mcp.json`)) {
  fail(`${PLUGIN_DIR}/.mcp.json is missing — the plugin would add no tools`)
} else {
  const server = readJson(`${PLUGIN_DIR}/.mcp.json`).mcpServers?.[SERVER_NAME]
  if (!server) {
    fail(`.mcp.json declares no "${SERVER_NAME}" server`)
  } else {
    const command = [server.command, ...(server.args ?? [])].join(' ')
    server.command === 'npx'
      ? pass('.mcp.json launches through npx, so no npm install is needed')
      : fail(`.mcp.json command is "${server.command}", expected "npx"`)
    command.includes(NPM_PACKAGE)
      ? pass(`.mcp.json starts ${NPM_PACKAGE}`)
      : fail(`.mcp.json does not mention ${NPM_PACKAGE}: ${command}`)
  }
}

// --------------------------------------------- 4. the marketplace points at it
if (!exists(MARKETPLACE)) {
  fail(`${MARKETPLACE} is missing`)
} else {
  const entry = readJson(MARKETPLACE).plugins?.find((p) => p.name === PLUGIN_NAME)
  if (!entry) {
    fail(`${MARKETPLACE} lists no "${PLUGIN_NAME}" entry`)
  } else {
    const expected = `./${PLUGIN_DIR}`
    entry.source === expected
      ? pass(`marketplace source is ${expected}`)
      : fail(`marketplace source is ${JSON.stringify(entry.source)}, expected "${expected}"`)

    // Two places to set a version is two places to forget one. The manifest
    // wins silently and `claude plugin validate` reports the mismatch, so the
    // entry must not carry one at all.
    entry.version === undefined
      ? pass('marketplace entry carries no version of its own')
      : fail('marketplace entry sets a version; the manifest is the single source of truth')
  }
}

// ------------------------------------------------------------------- summary
if (failures.length > 0) {
  console.error(`\n${failures.length} Claude Code plugin problem(s)`)
  process.exit(1)
}

console.log('\nClaude Code plugin ok')
