#!/usr/bin/env node
// Push the generated index.json to the public gist that serves it.
//
// The gist is what makes the Discover tab work: this repository is private, so
// a raw.githubusercontent.com link returns 401 to DSH's fetch, and the index
// has to live somewhere publicly readable.
//
// This uses the API rather than `gh gist edit`. `gh gist edit <id> --add <file>`
// does not replace an existing file — it tries to add a second one — which
// leaves the stale content served and is easy to mistake for success. The API
// PATCH replaces the named file by key.
//
// Run after `npm run make-index`:
//   npm run publish-index

import { execFileSync } from 'node:child_process'
import { readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

/** The gist that serves this package's index. Override with a positional id. */
const DEFAULT_GIST = '48f161bee2d78a7180de16e5f23c49bc'
const gist = process.argv[2] ?? DEFAULT_GIST

const content = readFileSync(join(root, 'index.json'), 'utf8')

// Fail before touching the network if the file is not what we mean to publish:
// a hand-edit that broke the JSON would otherwise be pushed and only surface as
// a red index in every user's Discover tab.
let parsed
try {
  parsed = JSON.parse(content)
} catch (error) {
  console.error(`publish-index: index.json is not valid JSON — ${error.message}`)
  process.exit(1)
}
if (parsed.format !== 1 || !Array.isArray(parsed.plugins) || parsed.plugins.length === 0) {
  console.error('publish-index: index.json is not a format-1 index with at least one plugin')
  process.exit(1)
}

// The body goes through a file, not argv: an inline 12 KB base64 icon in a
// shell argument runs into command-line length limits on Windows.
const bodyPath = join(root, '.gist-patch.json')
writeFileSync(bodyPath, JSON.stringify({ files: { 'index.json': { content } } }))

try {
  // No leading slash on the endpoint: Git Bash rewrites `/gists/...` into a
  // filesystem path and gh then reports an invalid API endpoint.
  const size = execFileSync(
    'gh',
    ['api', '-X', 'PATCH', `gists/${gist}`, '--input', bodyPath, '--jq', '.files["index.json"].size'],
    { cwd: root, encoding: 'utf8' },
  ).trim()
  console.log(`publish-index: uploaded ${size} bytes to gist ${gist}`)
  console.log(`  https://gist.githubusercontent.com/atifjubaer/${gist}/raw/index.json`)
  console.log('')
  console.log('  The CDN caches for 5 minutes (Cache-Control: max-age=300), so the')
  console.log('  old content can be served briefly after this succeeds.')
} finally {
  rmSync(bodyPath, { force: true })
}
