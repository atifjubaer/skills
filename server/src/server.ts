import { McpServer } from '@modelcontextprotocol/server';
import { loadSkills } from '@modelcontextprotocol/server/ext/skills/node';
import { z } from 'zod';
import type { AuthContext } from './auth.js';
import { registerFluentCartTools } from './cards/fluentcart/tools.js';
import { registerLemonSqueezyTools } from './cards/lemonsqueezy/tools.js';
import { skillsRoot } from './paths.js';
import { SUITE_VERSION } from './version.js';

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
    name: 'fastr-dev-suite',
    version: SUITE_VERSION
  });

  // 1. Attach Official MCP 2026-07-28 Skills Catalog
  try {
    const catalog = await skillsCatalog();
    if (catalog) catalog.attach(server);
  } catch (err: any) {
    console.error(`[Warning] Could not attach skills catalog: ${err.message}`);
  }

  // 2. Register Playing Card 1: FluentCart Developer Agent
  registerFluentCartTools(server);

  // 3. Register Playing Card 2: Lemon Squeezy Developer Agent
  registerLemonSqueezyTools(server);

  // 4. Session introspection: which transport this call arrived on, and what
  //    the suite costs. Free is a claim the server should be able to prove.
  server.registerTool(
    'suite_get_info',
    {
      description: 'Report what this suite contains, which tools serve which card, and how it is licensed. Every tool is free.',
      inputSchema: {
        card: z.enum(['all', 'fluentcart', 'lemonsqueezy']).default('all').describe('Limit the tool list to one Playing Card')
      },
      annotations: { readOnlyHint: true }
    },
    async ({ card }) => ({
      content: [{ type: 'text', text: JSON.stringify(suiteInfo(auth, card), null, 2) }]
    })
  );

  return server;
}

type CardFilter = 'all' | 'fluentcart' | 'lemonsqueezy';

const CARD_TOOLS: Record<Exclude<CardFilter, 'all'>, string[]> = {
  fluentcart: [
    'fc_search_hooks',
    'fc_get_db_schema',
    'fc_get_reference',
    'fc_generate_payment_gateway_boilerplate',
    'fc_generate_licensing_boilerplate',
    'fc_generate_customer_endpoint_boilerplate'
  ],
  lemonsqueezy: [
    'ls_search_docs',
    'ls_get_schema',
    'ls_get_reference',
    'ls_verify_webhook',
    'ls_validate_license'
  ]
};

const ALL_TOOLS = [...CARD_TOOLS.fluentcart, ...CARD_TOOLS.lemonsqueezy];

function suiteInfo(auth: AuthContext, card: CardFilter = 'all') {
  const cards = card === 'all' ? (Object.keys(CARD_TOOLS) as Array<keyof typeof CARD_TOOLS>) : [card];

  return {
    suite: 'fastr-dev-suite',
    version: SUITE_VERSION,
    licence: 'MIT',
    price: 'free',
    limits: 'none — unlimited tool calls, no account, no key, no subscription',
    session: { tier: auth.tier, transport: auth.source, reason: auth.reason },
    tools: {
      total: ALL_TOOLS.length + 1,
      registeredInThisSession: [...ALL_TOOLS, 'suite_get_info'],
      byCard: cards.map(name => ({ card: name, tools: CARD_TOOLS[name] }))
    },
    note:
      'Every tool is registered for every caller. There is nothing to unlock and ' +
      'no purchase link to follow: the server and the skills are MIT-licensed, so ' +
      'the fastest path to a change is a pull request.'
  };
}
