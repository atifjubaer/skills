#!/usr/bin/env node
// Build index.json at the repository root — the FastrSoft plugin marketplace
// for DeepSeek Harness, in `format: 1`.
//
// The index is generated, not hand-written: every listed version needs a real
// `publishTimestamp` and only the registry knows those. A hand-kept file drifts
// the first time someone publishes without updating it.
//
// It lives at the root because an index is a MARKETPLACE. It used to sit inside
// one plugin package and list only that plugin, which was fine for one and
// wrong for two: a catalogue cannot live inside one of its own entries.
//
// Adding a plugin needs no edit to this file. Create `plugins/<name>/` with a
// `dsh.bundle` (the compose layer) and a `dsh.marketplace` block (the card),
// and it appears here.
//
// Format: docs/user/guide/plugin-market.md in deepseek-ai/deepseek-harness.
//
//   npm run make-index      regenerate after a publish, then commit index.json

import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const REGISTRY = 'https://registry.npmjs.org'
const ICON_LIMIT_BYTES = 32 * 1024
const ICON_TYPES = { '.png': 'image/png', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' }

const repoPackage = JSON.parse(readFileSync(join(repoRoot, 'package.json'), 'utf8'))
const marketplace = repoPackage.marketplace
if (!marketplace?.title?.en) {
  throw new Error('make-index: package.json needs a `marketplace.title.en` — it names the index source.')
}

/**
 * A relative icon resolves against the index URL, so a host must serve the
 * icons beside the JSON. A single-file host cannot, and the icon then 404s
 * silently. Inlining keeps the index one self-contained file that works from
 * any static host. The format caps an inline icon at 32 KiB.
 *
 * @param {string} pluginDir
 * @param {string} relative
 * @returns {string}
 */
function inlineIcon(pluginDir, relative) {
  const file = resolve(pluginDir, relative)
  if (!existsSync(file)) {
    throw new Error(`make-index: icon not found at ${file}`)
  }
  const ext = file.slice(file.lastIndexOf('.')).toLowerCase()
  const mime = ICON_TYPES[ext]
  if (!mime) {
    throw new Error(`make-index: ${file} is not an icon type the format accepts (${Object.keys(ICON_TYPES).join(', ')})`)
  }
  const bytes = readFileSync(file)
  if (bytes.byteLength > ICON_LIMIT_BYTES) {
    throw new Error(
      `make-index: ${file} is ${bytes.byteLength} bytes; an inline icon is capped at ${ICON_LIMIT_BYTES}. Resize it, or serve it as a URL.`,
    )
  }
  return `data:${mime};base64,${bytes.toString('base64')}`
}

/** @param {string} path */
async function getJson(path) {
  const response = await fetch(`${REGISTRY}${path}`, { headers: { accept: 'application/json' } })
  if (!response.ok) {
    throw new Error(`registry ${path} -> ${response.status} ${response.statusText}`)
  }
  return response.json()
}

/**
 * Every installable version of one package, newest first.
 *
 * @param {string} name
 * @returns {Promise<{ versions: any[], latest: string }>}
 */
async function versionsOf(name) {
  const packument = await getJson(`/${name.replace('@', '%40')}`).catch((error) => {
    throw new Error(
      `${name} is not on the registry yet (${error.message}).\n` +
        'Publish it first: an index cannot list a version it cannot timestamp.',
    )
  })

  const latest = packument['dist-tags']?.latest
  if (!latest) throw new Error(`${name} has no latest dist-tag on the registry.`)

  const versions = Object.keys(packument.versions)
    .filter((version) => {
      const record = packument.versions[version]
      // Deprecated and private versions are not installable by a client.
      if (record.deprecated) return false
      if (record.private === true) return false
      // A version belongs in an index only if it actually declares a bundle.
      return Boolean(record.dsh?.bundle)
    })
    .map((version) => {
      const record = packument.versions[version]
      /** @type {{ version: string, publishTimestamp: number, source: { type: 'npm' }, engines?: { dsh: string } }} */
      const entry = {
        version,
        publishTimestamp: Math.floor(new Date(packument.time[version]).getTime() / 1000),
        source: { type: 'npm' },
      }
      const range = record.engines?.dsh
      if (typeof range === 'string' && range.length > 0) entry.engines = { dsh: range }
      return entry
    })
    .sort((a, b) => b.publishTimestamp - a.publishTimestamp)

  if (versions.length === 0) {
    throw new Error(
      `${name} has no published version that declares dsh.bundle. ` +
        'Check that package.json still carries the dsh.bundle key before publishing.',
    )
  }
  return { versions, latest }
}

const pluginsDir = join(repoRoot, 'plugins')
const cards = []
const skipped = []

for (const entry of readdirSync(pluginsDir, { withFileTypes: true })) {
  if (!entry.isDirectory() || entry.name.startsWith('.')) continue
  const pluginDir = join(pluginsDir, entry.name)
  const manifestPath = join(pluginDir, 'package.json')
  if (!existsSync(manifestPath)) {
    skipped.push(`${entry.name} (no package.json)`)
    continue
  }

  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  const card = manifest.dsh?.marketplace
  if (!manifest.dsh?.bundle) {
    skipped.push(`${entry.name} (no dsh.bundle — not installable)`)
    continue
  }
  if (!card?.title?.en) {
    skipped.push(`${entry.name} (no dsh.marketplace.title — nothing to show)`)
    continue
  }

  const { versions, latest } = await versionsOf(manifest.name)
  cards.push({
    name: manifest.name,
    title: card.title,
    ...(card.description ? { description: card.description } : {}),
    ...(card.icon ? { icon: inlineIcon(pluginDir, card.icon) } : {}),
    author: marketplace.author ?? 'FastrSoft',
    ...(manifest.homepage ? { homepage: manifest.homepage } : {}),
    ...(manifest.repository
      ? { repository: { url: String(manifest.repository.url).replace(/^git\+/, '').replace(/\.git$/, ''), directory: `plugins/${entry.name}` } }
      : {}),
    ...(card.category || card.labels
      ? {
          metadata: {
            ...(card.category ? { category: card.category } : {}),
            ...(card.labels ? { labels: card.labels } : {}),
            // null means "unavailable", which sorts last. A real zero is a value.
            sortKeys: { npm_weekly_downloads: null },
          },
        }
      : {}),
    versions,
  })
  console.log(`  ${manifest.name}: ${versions.length} version(s), latest ${latest}`)
}

if (cards.length === 0) {
  throw new Error('make-index: no plugin under plugins/ declares both dsh.bundle and dsh.marketplace.')
}
for (const note of skipped) console.log(`  skipped ${note}`)

const index = {
  format: 1,
  title: marketplace.title,
  ...(marketplace.description ? { description: marketplace.description } : {}),
  ...(marketplace.categories || marketplace.labels || marketplace.sortKeys
    ? {
        metadata: {
          ...(marketplace.categories ? { categories: marketplace.categories } : {}),
          ...(marketplace.labels ? { labels: marketplace.labels } : {}),
          ...(marketplace.sortKeys ? { sortKeys: marketplace.sortKeys } : {}),
        },
      }
    : {}),
  plugins: cards,
}

const output = join(repoRoot, 'index.json')
writeFileSync(output, `${JSON.stringify(index, null, 2)}\n`)
console.log(`make-index: ${cards.length} plugin(s) -> ${output}`)
