import { McpServer } from '@modelcontextprotocol/server';
import { loadSkills } from '@modelcontextprotocol/server/ext/skills/node';
import { z } from 'zod';
import type { AuthContext } from './auth.js';
import { registerFluentCartTools } from './cards/fluentcart/tools.js';
import { skillsRoot } from './paths.js';
import { SERVER_VERSION } from './version.js';

type SkillCatalog = Awaited<ReturnType<typeof loadSkills>>;

/**
 * The skills catalog is static: it is read from disk and never depends on the
 * caller. Building it costs ~20 ms (64 files, 1.6 MB) — 99% of a per-request
 * server, since the HTTP handler builds a fresh McpServer for every call. So it
 * is loaded once per process and the same catalogue is attached to each
 * request's server; attaching a built catalogue costs ~0.03 ms.
 *
 * A failed load is not cached: the next request tries again rather than leaving
 * the process without a catalogue until it restarts.
 */
let catalogPromise: Promise<SkillCatalog | null> | undefined;

function skillsCatalog(): Promise<SkillCatalog | null> {
  catalogPromise ??= loadSkills(skillsRoot(), {
    // The FluentCart corpus is 588 documentation pages plus FastrSoft's own
    // references — 604 files, past the SDK's default ceiling of 512. That
    // ceiling is a publication-size heuristic, not a protocol limit, so raise
    // it rather than ship a server that warns on every boot.
    limits: { files: 4096, bytes: 64 * 1024 * 1024 }
  }).catch((err: any) => {
    console.error(`[Warning] Could not load skills catalog: ${err.message}`);
    catalogPromise = undefined;
    return null;
  });
  return catalogPromise;
}

/**
 * Sent in the `initialize` handshake and injected into the system prompt by
 * every client that supports the field — Claude Code, OpenCode and DeepSeek
 * Harness all do.
 *
 * This exists because a skill is advisory. A skill file says how to work, but
 * nothing makes a model read it: one that goes straight to the tools gets
 * twelve tools and no rules, which is exactly how a wrong endpoint or an
 * invented hook signature gets written. These instructions arrive before the
 * first turn, so they cannot be skipped.
 *
 * Keep this to what prevents a wrong answer. Every line costs tokens on every
 * session, and the 588 documentation pages stay out deliberately — the tools
 * fetch those on demand.
 */
const INSTRUCTIONS = `FluentCart is a WordPress e-commerce plugin with its own REST API, Eloquent models, and 315+ action and filter hooks. None of it can be recalled from general WordPress knowledge: every endpoint path, hook signature and wp_fct_ table is specific to this plugin and changes between versions.

Do not answer a FluentCart question from memory. Look it up.

Tools:
- fc_search_docs — find the page. Every query word must match; an optional prefix scopes to restapi/, database/, hooks/ or modules/.
- fc_get_reference — read one page by path, or one heading inside it.
- fc_search_hooks — an action or filter, by name or domain.
- fc_get_db_schema — one wp_fct_* table.
- fc_generate_payment_gateway_boilerplate, fc_generate_licensing_boilerplate, fc_generate_customer_endpoint_boilerplate, fc_generate_device_licensing_boilerplate, fc_generate_trial_guard_boilerplate, fc_generate_client_sdk, fc_generate_native_client — working code. Prefer these to hand-writing: they already encode the hooks, the order they fire in, and the response shapes.

Read the page before writing code that depends on it. A signature you did not read is a signature you invented. Cite the page you used, for example restapi/operations/orders/get-orders.md.

Rules that keep the generated code correct:
- Never modify FluentCart core. Extend through hooks, filters and documented extension points. A core edit is lost on update and is not a supported integration.
- Prefix every function and hook with your own plugin prefix, never fluentcart_ or fct_.
- Every PHP file starts with: defined('ABSPATH') || exit;
- Sanitize input, escape all output, and check current_user_can on every admin action and REST route.
- Ask the user for the productId, class prefix and namespace. Do not guess them.

When the documentation and the user's existing code disagree, say so instead of silently picking one.`;

export async function createServerInstance(auth: AuthContext): Promise<McpServer> {
  const server = new McpServer(
    {
      name: 'fluentcart-developer',
      version: SERVER_VERSION
    },
    { instructions: INSTRUCTIONS }
  );

  // 1. Attach the official MCP skills catalog so the client can load SKILL.md.
  try {
    const catalog = await skillsCatalog();
    if (catalog) catalog.attach(server);
  } catch (err: any) {
    console.error(`[Warning] Could not attach skills catalog: ${err.message}`);
  }

  // 2. Register this package's tools.
  registerFluentCartTools(server);

  // 3. Session introspection: which transport this call arrived on, and what it
  //    costs. Free is a claim the server should be able to prove.
  server.registerTool(
    'get_info',
    {
      description: 'Report what this server contains, which tools it exposes, and how it is licensed. Every tool is free.',
      inputSchema: {
        verbose: z.boolean().default(false).describe('List every registered tool name, not just the count')
      },
      annotations: { readOnlyHint: true }
    },
    async ({ verbose }) => ({
      content: [{ type: 'text', text: JSON.stringify(serverInfo(auth, verbose), null, 2) }]
    })
  );

  return server;
}

const TOOLS = [
  "fc_search_hooks",
  "fc_get_db_schema",
  "fc_get_reference",
  "fc_search_docs",
  "fc_generate_payment_gateway_boilerplate",
  "fc_generate_licensing_boilerplate",
  "fc_generate_customer_endpoint_boilerplate",
  "fc_generate_device_licensing_boilerplate",
  "fc_generate_trial_guard_boilerplate",
  "fc_generate_client_sdk",
  "fc_generate_native_client"
];

function serverInfo(auth: AuthContext, verbose = false) {
  const all = [...TOOLS, 'get_info'];
  return {
    name: 'fluentcart-developer',
    version: SERVER_VERSION,
    description: "MCP server for FluentCart developer knowledge: documentation search, database schema lookup, hook discovery, reference reading, and boilerplate generation for gateways, licensing, customers, device licensing, trial guards and client SDKs.",
    price: 'free',
    licence: 'MIT',
    session: {
      tier: auth.tier,
      transport: auth.source,
      cards: auth.cards,
      reason: auth.reason
    },
    card: 'fluentcart',
    skills: ['fluentcart-developer'],
    tools: {
      total: all.length,
      domain: TOOLS,
      introspection: ['get_info'],
      ...(verbose ? { registeredInThisSession: all } : {})
    }
  };
}
