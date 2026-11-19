/**
 * FluentCart developer tools for DeepSeek Harness.
 *
 * The bundle patch inserts this one row. On apply it does two things:
 *
 *   1. mounts the `fluentcart` MCP server through the host's own
 *      `@deepseek-ai/dsh-mcp-client`, and
 *   2. registers the packaged `fluentcart-developer` skill so the model knows
 *      the tools exist and when to reach for them.
 *
 * The server binary is resolved from this package's dependencies rather than
 * from PATH, and it is launched with the Node that is already running the host.
 * That is why there is no `npx` here: `npx` needs a shell on Windows, needs the
 * network on first run, and can silently pick up a different Node than the one
 * the harness is using.
 *
 * @module dsh-plugin-fluentcart
 */

import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import * as McpClient from '@deepseek-ai/dsh-mcp-client'

/** Cordis plugin identity. */
export const name = 'fluentcart'

/** The MCP client publishes its tools through the shared registry, so that must exist first. */
export const inject = ['tools']

/** Server name the tools are namespaced under: `mcp__fluentcart__fc_search_docs`, and so on. */
const SERVER_NAME = 'fluentcart'

const here = dirname(fileURLToPath(import.meta.url))
const packageRoot = join(here, '..')
const skillFile = join(packageRoot, 'skills', 'fluentcart-developer', 'SKILL.md')

/**
 * Locate the compiled MCP server.
 *
 * `FLUENTCART_MCP_ENTRY` wins so a local checkout can be pointed at without
 * republishing this plugin. Otherwise the dependency is resolved from this
 * package, which under pnpm lands in this package's own symlinked store.
 *
 * @returns {string} absolute path to the server entry module.
 */
function resolveServerEntry() {
  const override = process.env.FLUENTCART_MCP_ENTRY
  if (override) {
    if (!existsSync(override)) {
      throw new Error(
        `dsh-plugin-fluentcart: FLUENTCART_MCP_ENTRY points at ${override}, which does not exist.`,
      )
    }
    return override
  }

  const require = createRequire(import.meta.url)
  const failures = []
  for (const specifier of ['fluentcart-developer/dist/index.js', 'fluentcart-developer']) {
    try {
      return require.resolve(specifier)
    } catch (error) {
      failures.push(`${specifier}: ${error.code ?? error.message}`)
    }
  }

  throw new Error(
    'dsh-plugin-fluentcart: cannot find the fluentcart-developer package. ' +
      'Its MCP server ships separately, so it must be installed beside this plugin. ' +
      `Tried:\n  ${failures.join('\n  ')}\n` +
      'Reinstall the plugin, or set FLUENTCART_MCP_ENTRY to the absolute path of dist/index.js.',
  )
}

/**
 * Split YAML frontmatter from a Markdown body.
 *
 * Deliberately tiny: it reads the flat `key: value` pairs the skill format
 * uses and ignores everything else. It is not a YAML parser and must not grow
 * into one — the local skill provider does the real parsing for on-disk
 * skills; this only feeds `ctx.skills.register()` with a definition that is
 * already correct on disk.
 *
 * @param {string} source - the whole SKILL.md file.
 * @returns {{fields: Record<string, string>, body: string}}
 */
function parseFrontmatter(source) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(source)
  if (!match) return { fields: {}, body: source }

  const fields = {}
  for (const line of match[1].split(/\r?\n/)) {
    const pair = /^([A-Za-z0-9_-]+):[ \t]*(.*)$/.exec(line)
    if (!pair) continue
    let value = pair[2].trim()
    // Unwrap a quoted scalar; leave anything else (lists, blocks) untouched.
    if (
      value.length >= 2 &&
      ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'")))
    ) {
      value = value.slice(1, -1)
    }
    fields[pair[1]] = value
  }
  return { fields, body: match[2] }
}

/**
 * Read the packaged skill.
 *
 * @returns {{name: string, description: string, content: string, path: string}}
 */
function readSkill() {
  const source = readFileSync(skillFile, 'utf8')
  const { fields, body } = parseFrontmatter(source)
  const skillName = fields.name
  const description = fields.description
  if (!skillName || !description) {
    throw new Error(
      `dsh-plugin-fluentcart: ${skillFile} is missing a name or description in its frontmatter.`,
    )
  }
  return { name: skillName, description, content: body.trim(), path: skillFile }
}

/**
 * Register the skill and connect the MCP server.
 *
 * The skill is best-effort: a host composed without the skills service should
 * still get the tools, because the tools are the part that does the work. The
 * MCP connection is not best-effort — `failOnStartupError` is on, so a server
 * that cannot start rejects this plugin's activation instead of leaving the
 * model with a skill describing tools that are not there.
 *
 * @param {import('@deepseek-ai/cordis').Context} ctx - context providing the tool registry.
 * @returns {Promise<void>} settles once initial MCP tool discovery completes.
 */
export async function apply(ctx) {
  if (ctx.skills) {
    try {
      const skill = readSkill()
      ctx.skills.register({
        ...skill,
        provider: 'fluentcart',
        invocation: { modelInvocable: true, userInvocable: true },
      })
    } catch (error) {
      ctx.logger?.warn?.(`dsh-plugin-fluentcart: skill not registered — ${error.message}`)
    }
  }

  const connection = McpClient.Config({
    transport: 'stdio',
    serverName: SERVER_NAME,
    command: process.execPath,
    args: [resolveServerEntry()],
    // The doc tools read local Markdown; a cold start on Windows can still take
    // a few seconds, and a generation call writes a file. A minute is the MCP
    // client's default and is enough here, so it is left alone.
    failOnStartupError: true,
  })

  // One effect orders child shutdown before this plugin finishes disposing;
  // separate effects unload concurrently and would leave the child running
  // against a context that is already gone.
  /** @type {import('@deepseek-ai/cordis').Fiber} */
  let child
  ctx.effect(function* () {
    child = ctx.plugin(McpClient, connection)
    yield child.dispose
  }, 'fluentcart.connection')

  await child.await()
}
