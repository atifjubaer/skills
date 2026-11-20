#!/usr/bin/env node
// Build index.json — a DeepSeek Harness plugin index in `format: 1`.
//
// The index is generated rather than hand-written because every version needs
// a real `publishTimestamp`, and only the registry knows those. A hand-kept
// file drifts the first time someone publishes without updating it.
//
// Run after publishing:
//   npm run make-index
//
// Format: docs/user/guide/plugin-market.md in deepseek-ai/deepseek-harness.

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const manifest = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
const { name } = manifest

const REGISTRY = 'https://registry.npmjs.org'

// The icon is inlined as a `data:` URL rather than left as a relative path.
// A relative icon resolves against the index URL, which means the host has to
// serve an `icons/` directory beside the JSON. A single-file host — a gist, for
// one — cannot, and the icon then silently 404s. Inlining makes the index one
// self-contained file that works from any static host. The format caps an
// inline icon at 32 KiB; this one is 7 KB.
const ICON_PATH = join(root, 'icons', 'fluentcart.png')
const ICON_LIMIT_BYTES = 32 * 1024

const iconBytes = readFileSync(ICON_PATH)
if (iconBytes.byteLength > ICON_LIMIT_BYTES) {
  throw new Error(
    `make-index: ${ICON_PATH} is ${iconBytes.byteLength} bytes; ` +
      `an inline icon is capped at ${ICON_LIMIT_BYTES}. Resize it, or serve it as a URL instead.`,
  )
}
const icon = `data:image/png;base64,${iconBytes.toString('base64')}`

/** @param {string} path */
async function getJson(path) {
  const response = await fetch(`${REGISTRY}${path}`, {
    headers: { accept: 'application/json' },
  })
  if (!response.ok) {
    throw new Error(`registry ${path} -> ${response.status} ${response.statusText}`)
  }
  return response.json()
}

const packument = await getJson(`/${encodeURIComponent(name).replace('%40', '@')}`).catch((error) => {
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
    // A version only belongs in an index if it actually declares a bundle.
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

const index = {
  format: 1,
  // The index title is the MARKETPLACE, not a product. It names whoever
  // publishes the plugins in it; each plugin then carries its own title on its
  // card. Calling the marketplace "FluentCart" made a one-product index, and
  // that name is what a reader sees when they pick an index source.
  title: { en: 'FastrSoft' },
  description: {
    en: 'Plugins from FastrSoft for AI coding tools — documentation search, code generation, and the connectors around them.',
  },
  metadata: {
    categories: {
      development: { title: { en: 'Development' } },
    },
    labels: {
      wordpress: { title: { en: 'WordPress' } },
      ecommerce: { title: { en: 'E-commerce' } },
      mcp: { title: { en: 'MCP server' } },
      skills: { title: { en: 'Ships a skill' } },
    },
    sortKeys: {
      npm_weekly_downloads: { title: { en: 'Weekly downloads' }, order: 'desc' },
    },
  },
  plugins: [
    {
      name,
      title: { en: 'FluentCart Developer' },
      description: {
        en: 'Adds the fluentcart MCP server (6 tools over 593 documentation pages) and the fluentcart-developer skill. Free, local, no licence key.',
      },
      icon,
      author: 'FastrSoft',
      homepage: manifest.homepage,
      repository: {
        url: 'https://github.com/atifjubaer/skills',
        directory: 'plugins/dsh-plugin-fluentcart',
      },
      metadata: {
        category: 'development',
        labels: ['wordpress', 'ecommerce', 'mcp', 'skills'],
        // null means "unavailable", which sorts last. A real zero is a value.
        sortKeys: { npm_weekly_downloads: null },
      },
      versions,
    },
  ],
}

const output = join(root, 'index.json')
writeFileSync(output, `${JSON.stringify(index, null, 2)}\n`)
console.log(`make-index: ${versions.length} version(s) -> ${output}`)
for (const entry of versions) console.log(`  ${name}@${entry.version}`)
console.log(`  latest: ${latest}`)
