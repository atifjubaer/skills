#!/usr/bin/env node
// Copy a captured `.vendor-docs/` snapshot into the skill's `references/` tree.
//
// `sync-fluentcart-docs.mjs` captures every page from dev.fluentcart.com into
// `.vendor-docs/fluentcart-dev/`, which is git-ignored. Nothing in the
// repository mirrors that into `skills/fluentcart-developer/references/`, so
// for a long time the copy was a manual step — which meant the corpus could
// silently disagree with the snapshot, and no automation could ever detect
// vendor drift because the checked-in files never moved.
//
// This script is that missing step. It is deliberately conservative:
//
//   - it only ever writes files the capture produced, so the FastrSoft-authored
//     pages (which the vendor site does not have) are never touched;
//   - it never deletes. A page that vanished upstream shows up in the report so
//     a human decides, because a deleted page may still be cited by a template
//     or a hook reference;
//   - it rebuilds nothing but the files themselves. `references/INDEX.md` is
//     hand-curated and gets a warning instead of a rewrite.
//
//   node scripts/sync-docs-into-skill.mjs            # apply
//   node scripts/sync-docs-into-skill.mjs --dry-run  # report only
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

for (const rel of pages) {
  const source = path.join(SNAPSHOT, rel)
  const dest = path.join(TARGET, rel)
  const next = await fs.readFile(source, 'utf8')

  if (!existsSync(dest)) {
    added.push(rel)
  } else {
    const current = await fs.readFile(dest, 'utf8')
    if (current === next) {
      unchanged.push(rel)
      continue
    }
    updated.push(rel)
  }

  if (!DRY_RUN) {
    await fs.mkdir(path.dirname(dest), { recursive: true })
    await fs.writeFile(dest, next, 'utf8')
  }
}

// Pages the corpus has that the capture did not produce. These are the
// FastrSoft-authored files plus anything removed upstream, and the two need
// different handling — so this reports rather than guesses.
const inCorpus = await markdownFiles(TARGET)
const capturedSet = new Set(pages.map((rel) => path.normalize(rel)))
const notFromVendor = inCorpus.filter((rel) => !capturedSet.has(path.normalize(rel)))

const label = DRY_RUN ? 'would change' : 'changed'
console.log(
  `\n${pages.length} page(s) captured · ${added.length} new · ${updated.length} ${label} · ${unchanged.length} unchanged`,
)
for (const rel of added) console.log(`  + ${rel}`)
for (const rel of updated) console.log(`  ~ ${rel}`)

if (notFromVendor.length > 0) {
  console.log(`\n${notFromVendor.length} file(s) in the corpus did not come from this capture (left alone):`)
  for (const rel of notFromVendor.slice(0, 10)) console.log(`  · ${rel}`)
  if (notFromVendor.length > 10) console.log(`  · …and ${notFromVendor.length - 10} more`)
}

// INDEX.md is hand-curated — it separates the FastrSoft originals from the
// vendor mirror — so it is deliberately not regenerated here. A page added
// upstream therefore needs a manual line in it; that reminder lives in
// UPDATING.md rather than in a count comparison, because the count has nested
// `index.md` pages in it and a wrong warning is worse than none.
if (added.length > 0) {
  console.log('\nNew pages were added. `references/INDEX.md` is hand-curated — check it.')
}

if (DRY_RUN) console.log('\nDry run: nothing was written.')
