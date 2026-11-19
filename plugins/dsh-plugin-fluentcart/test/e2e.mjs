#!/usr/bin/env node
// End-to-end check: mount this plugin in a real Cordis context, let it connect
// the real MCP server as a real child process, and assert what came back.
//
// The `tools` and `skills` services are stubs, not the harness ones. That is
// deliberate and it is the only stub in the test: the MCP client is the real
// published package, the server is the real compiled binary spawned over a real
// stdio pipe, and the tool definitions asserted below are what the server
// actually advertised. Stubbing the registries keeps the test free of an LLM,
// a system prompt, and a session, none of which this plugin touches.

import { readFileSync } from 'node:fs'

import { Context } from '@deepseek-ai/cordis'

import * as plugin from '../lib/index.js'

const TOOL_PREFIX = 'mcp__fluentcart__'
const EXPECTED = [
  'fc_search_docs',
  'fc_get_reference',
  'fc_search_hooks',
  'fc_get_db_schema',
  'fc_generate_payment_gateway_boilerplate',
  'fc_generate_licensing_boilerplate',
  'fc_generate_customer_endpoint_boilerplate',
  'fc_generate_device_licensing_boilerplate',
  'fc_generate_trial_guard_boilerplate',
  'fc_generate_client_sdk',
  'fc_generate_native_client',
  'get_info',
]

/** @type {string[]} */
const registered = []
/** @type {unknown[]} */
const skills = []

const ctx = new Context()
ctx.provide('tools', {
  register(definition) {
    registered.push(definition.name)
    return () => {}
  },
})
ctx.provide('skills', {
  register(skill) {
    skills.push(skill)
    return () => {}
  },
})

const failures = []
const check = (ok, label, detail = '') => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? ` — ${detail}` : ''}`)
  if (!ok) failures.push(label)
}

const fiber = await ctx.plugin(plugin)

// --- plugin identity -------------------------------------------------------
check(plugin.name === 'fluentcart', 'plugin exports name', plugin.name)
check(
  Array.isArray(plugin.inject) && plugin.inject.includes('tools'),
  'plugin injects tools',
  JSON.stringify(plugin.inject),
)
check(
  Array.isArray(plugin.inject) && plugin.inject.includes('skills'),
  'plugin injects skills',
  JSON.stringify(plugin.inject),
)

// Cordis proxies services so that *reading* an un-injected one throws, which
// means a `if (ctx.skills)` guard is itself the crash rather than the guard.
// That bug shipped once and this check exists to stop it coming back: every
// `ctx.<name>` the plugin reads must be declared in `inject`, unless it is a
// member Cordis mixes onto every context.
const CONTEXT_MEMBERS = new Set([
  'baseUrl', 'effect', 'emit', 'events', 'extend', 'get', 'inject', 'intercept',
  'isolate', 'logger', 'mixin', 'on', 'parallel', 'plugin', 'provide', 'reflect',
  'registry', 'root', 'serial', 'set',
])
const source = readFileSync(new URL('../lib/index.js', import.meta.url), 'utf8')
const reads = new Set([...source.matchAll(/\bctx\.([A-Za-z_$][\w$]*)/g)].map((m) => m[1]))
const undeclared = [...reads].filter((key) => !CONTEXT_MEMBERS.has(key) && !plugin.inject.includes(key))
check(
  undeclared.length === 0,
  'every ctx service read is declared in inject',
  undeclared.length ? `undeclared: ${undeclared.join(', ')}` : [...reads].join(', '),
)

// --- MCP connection --------------------------------------------------------
check(registered.length > 0, 'MCP tools registered', `${registered.length} tools`)

const missing = EXPECTED.filter((t) => !registered.includes(`${TOOL_PREFIX}${t}`))
check(missing.length === 0, 'every expected tool present', missing.length ? `missing: ${missing.join(', ')}` : '')

const unexpected = registered.filter((t) => !t.startsWith(TOOL_PREFIX))
check(unexpected.length === 0, 'no tools outside the fluentcart namespace', unexpected.join(', '))

// --- skill -----------------------------------------------------------------
check(skills.length === 1, 'skill registered once', `${skills.length}`)
if (skills[0]) {
  const skill = skills[0]
  check(skill.name === 'fluentcart-developer', 'skill name', skill.name)
  check(typeof skill.description === 'string' && skill.description.length > 80, 'skill description is substantive')
  check(typeof skill.content === 'string' && skill.content.length > 500, 'skill body is substantive', `${skill.content?.length ?? 0} chars`)
  check(!skill.content.startsWith('---'), 'skill body has frontmatter stripped')
  check(skill.invocation?.modelInvocable === true, 'skill is model-invocable')
}

// --- teardown --------------------------------------------------------------
// Unloading the plugin must stop the child process. If the effect in apply()
// were wrong, the spawned server would outlive the fiber, keep this Node
// process alive on its open stdio pipes, and the test would hang here instead
// of exiting — which is exactly the failure this section is here to catch.
await fiber.dispose()

console.log('')
if (failures.length) {
  console.error(`${failures.length} check(s) failed: ${failures.join(', ')}`)
  process.exit(1)
}
console.log(`All checks passed.`)
