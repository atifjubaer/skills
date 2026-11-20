#!/usr/bin/env node
// Copy a captured `.vendor-docs/` snapshot into the skill's `references/` tree.
//
// `sync-fluentcart-docs.mjs` captures every page from dev.fluentcart.com into
// `.vendor-docs/fluentcart-dev/`, which is git-ignored. Nothing in the
// repository mirrors that into `skills/fluentcart-developer/references/`, so
// for a long time the copy was a manual step — which meant the corpus could
// silently disagree with the snapshot, and no automation could detect vendor
// drift because the checked-in files never moved.
//
// This script is that missing step. It is deliberately conservative, because
// the first time it ran for real it destroyed a file:
//
//   - `index.md` is hand-curated, not captured. But the vendor's site root also
//     resolves to `index.md`, so a naive copy overwrote a 625-line documentation
//     index with a two-line landing-page stub. It is now protected by name.
//   - a capture can come back as a shell (the OpenAPI pages render client-side,
//     and the fallback that covers them can fail). Copying that over a real
//     page loses content permanently, so a capture that is a small fraction of
//     the page it would replace is treated as suspect and skipped, not applied.
//   - it never deletes. A page that vanished upstream is reported for a human,
//     because it may still be cited by a template.
//
//   node scripts/sync-docs-into-skill.mjs            # apply
//   node scripts/sync-docs-into-skill.mjs --dry-run  # report only
//   node scripts/sync-docs-into-skill.mjs --force    # allow a large shrink
//
// Run `npm run sync:docs` first; this reads what that produced.

import fs from 'node:fs/promises'
import path from 'node:path'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SNAPSHOT = path.join(repoRoot, '.vendor-docs', 'fluentcart-dev')
const TARGET = path.join(repoRoot, 'skills', 'fluentcart-developer', 'references')

const DRY_RUN = process.argv.includes('--dry-run')
const FORCE = process.argv.includes('--force')

// Files at the top of `references/` that a human maintains. The vendor site
// does not produce them; the names collide by accident, so the capture loses.
const PROTECTED = new Set(['index.md'])

// A capture smaller than this fraction of the page it would replace is treated
// as a failed fetch rather than a real edit to the documentation.
const SHRINK_RATIO = 0.25
const MIN_BYTES = 200

/** Every `.md` under `dir`, as paths relative to it. */
async function markdownFiles(dir, base = dir, found = []) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      await markdownFiles(full, base, found)
    } else if (entry.name.endsWith('.md')) {
      found.push(path.relative(base, full))
    }
  }
  return found
}

if (!existsSync(SNAPSHOT)) {
  console.error(
    `sync-docs-into-skill: no snapshot at ${SNAPSHOT}.\n` +
      'Run `npm run sync:docs` first — this copies what that captured, it does not fetch.',
  )
  process.exit(1)
}

const captured = await markdownFiles(SNAPSHOT)
if (captured.length === 0) {
  console.error(`sync-docs-into-skill: ${SNAPSHOT} holds no Markdown. Refusing to blank the corpus.`)
  process.exit(1)
}

// The manifest is metadata about the capture, not a page, and must not land in
// the corpus. It is filtered by name rather than by extension for that reason.
const pages = captured.filter((rel) => path.basename(rel) !== '_manifest.json')

const added = []
const updated = []
const unchanged = []
const protectedNames = []
const suspicious = []

for (const rel of pages) {
  const normalised = rel.split(path.sep).join('/')

  if (PROTECTED.has(normalised.toLowerCase())) {
    protectedNames.push(normalised)
    continue
  }

  const source = path.join(SNAPSHOT, rel)
  const dest = path.join(TARGET, rel)
  const next = await fs.readFile(source, 'utf8')
  const nextBytes = Buffer.byteLength(next, 'utf8')

  if (!existsSync(dest)) {
    added.push(normalised)
    if (!DRY_RUN) {
      await fs.mkdir(path.dirname(dest), { recursive: true })
      await fs.writeFile(dest, next, 'utf8')
    }
    continue
  }

  const current = await fs.readFile(dest, 'utf8')
  if (current === next) {
    unchanged.push(normalised)
    continue
  }

  const currentBytes = Buffer.byteLength(current, 'utf8')
  const shrunk = currentBytes > MIN_BYTES && nextBytes < currentBytes * SHRINK_RATIO && !FORCE

  if (shrunk) {
    // Almost always a capture that failed rather than the documentation
    // changing. Report it with both sizes so the next person can tell which.
    suspicious.push({ rel: normalised, from: currentBytes, to: nextBytes })
    continue
  }

  updated.push(normalised)
  if (!DRY_RUN) await fs.writeFile(dest, next, 'utf8')
}

// Pages the corpus has that the capture did not produce. These are the
// FastrSoft-authored files plus anything removed upstream, and the two need
// different handling — so this reports rather than guesses.
const inCorpus = await markdownFiles(TARGET)
const capturedSet = new Set(pages.map((rel) => rel.split(path.sep).join('/').toLowerCase()))
const notFromVendor = inCorpus.filter(
  (rel) => !capturedSet.has(rel.split(path.sep).join('/').toLowerCase()),
)

const label = DRY_RUN ? 'would change' : 'changed'
console.log(
  `\n${pages.length} page(s) captured · ${added.length} new · ${updated.length} ${label} · ${unchanged.length} unchanged`,
)
for (const rel of added) console.log(`  + ${rel}`)
for (const rel of updated) console.log(`  ~ ${rel}`)

if (protectedNames.length > 0) {
  console.log(`\n${protectedNames.length} protected file(s) left alone despite a name collision:`)
  for (const rel of protectedNames) console.log(`  ! ${rel} — hand-curated, not from the vendor site`)
}

if (suspicious.length > 0) {
  console.error(
    `\n${suspicious.length} page(s) skipped: the capture is far smaller than the page it would replace.`,
  )
  for (const s of suspicious) console.error(`  ! ${s.rel} — ${s.from} B → ${s.to} B`)
  console.error(
    '    This is usually a failed fetch, not an edit. Re-run `npm run sync:docs` for these pages,\n' +
      '    or pass --force if the page really did get shorter.',
  )
}

if (notFromVendor.length > 0) {
  console.log(`\n${notFromVendor.length} file(s) in the corpus did not come from this capture (left alone):`)
  for (const rel of notFromVendor.slice(0, 5)) console.log(`  · ${rel.split(path.sep).join('/')}`)
  if (notFromVendor.length > 5) console.log(`  · …and ${notFromVendor.length - 5} more`)
}

// INDEX.md is hand-curated — it separates the FastrSoft originals from the
// vendor mirror — so it is deliberately not regenerated here. A page added
// upstream therefore needs a manual line in it.
if (added.length > 0) {
  console.log('\nNew pages were added. `references/index.md` is hand-curated — check it.')
}

if (DRY_RUN) console.log('\nDry run: nothing was written.')
if (suspicious.length > 0) process.exitCode = 2
