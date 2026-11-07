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
  catalogPromise ??= loadSkills(skillsRoot()).catch((err: any) => {
    console.error(`[Warning] Could not load skills catalog: ${err.message}`);
    catalogPromise = undefined;
    return null;
  });
  return catalogPromise;
}

export async function createServerInstance(auth: AuthContext): Promise<McpServer> {
  const server = new McpServer({
    name: 'fluentcart-developer',
    version: SERVER_VERSION
  });

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
