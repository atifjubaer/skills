import { McpServer } from '@modelcontextprotocol/server';
import { loadSkills } from '@modelcontextprotocol/server/ext/skills/node';
import { z } from 'zod';
import type { AuthContext } from './auth.js';
import { registerFluentCartTools } from './cards/fluentcart/tools.js';
import { registerLemonSqueezyTools } from './cards/lemonsqueezy/tools.js';
import { skillsRoot } from './paths.js';

type SkillCatalog = Awaited<ReturnType<typeof loadSkills>>;

/**
 * The skills catalog is static: it is read from disk and never depends on the
 * caller's tier. Building it costs ~20 ms (64 files, 1.6 MB) — 99% of a
 * per-request server, since the HTTP handler builds a fresh McpServer for every
 * call. So it is loaded once per process and the same catalogue is attached to
 * each request's server; attaching a built catalogue costs ~0.03 ms.
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
    version: '1.0.0'
  });

  // 1. Attach Official MCP 2026-07-28 Skills Catalog
  try {
    const catalog = await skillsCatalog();
    if (catalog) catalog.attach(server);
  } catch (err: any) {
    console.error(`[Warning] Could not attach skills catalog: ${err.message}`);
  }

  // 2. Register Playing Card 1: FluentCart Pro Agent
  registerFluentCartTools(server, auth);

  // 3. Register Playing Card 2: Lemon Squeezy Developer Agent
  registerLemonSqueezyTools(server, auth);

  // 4. Conversion surface: always readable, tells a core client what Pro adds.
  server.registerTool(
    'suite_get_pro_info',
    {
      description: 'List the Pro-only tools in this suite and how to unlock them for the current session.',
      inputSchema: {
        card: z.enum(['all', 'fluentcart', 'lemonsqueezy']).default('all').describe('Limit the list to one Playing Card')
      },
      annotations: { readOnlyHint: true }
    },
    async ({ card }) => ({
      content: [{ type: 'text', text: JSON.stringify(proInfo(auth, card), null, 2) }]
    })
  );

  return server;
}

type CardFilter = 'all' | 'fluentcart' | 'lemonsqueezy';

interface ProTool {
  card: string;
  cardId: Exclude<CardFilter, 'all'>;
  tool: string;
  gives: string;
}

const PRO_TOOLS: ProTool[] = [
  {
    card: 'FluentCart Pro Agent',
    cardId: 'fluentcart',
    tool: 'fc_generate_payment_gateway_boilerplate',
    gives: 'Production-ready PHP payment gateway class with settings schema and webhook entry point'
  },
  {
    card: 'Lemon Squeezy Developer Agent',
    cardId: 'lemonsqueezy',
    tool: 'ls_verify_webhook',
    gives: 'Timing-safe HMAC-SHA256 signature verification for incoming webhooks'
  },
  {
    card: 'Lemon Squeezy Developer Agent',
    cardId: 'lemonsqueezy',
    tool: 'ls_validate_license',
    gives: 'Live license key validation against the Lemon Squeezy API'
  }
];

function proInfo(auth: AuthContext, card: CardFilter = 'all') {
  const entitled = new Set(auth.cards);
  const visible = card === 'all' ? PRO_TOOLS : PRO_TOOLS.filter(t => t.cardId === card);
  const proTools = visible.map(t => ({ ...t, unlocked: entitled.has(t.cardId) }));
  const locked = proTools.filter(t => !t.unlocked);

  return {
    tier: auth.tier,
    cards: auth.cards,
    reason: auth.reason,
    proTools,
    unlock:
      visible.length === 0
        ? 'No Pro tools match that card filter.'
        : locked.length === 0
          ? 'Every Pro tool listed here is registered and callable in this session.'
          : `Not registered in this session: ${locked.map(t => t.tool).join(', ')}. Local stdio: set PRO_LICENSE_KEY in the server environment. HTTP: send "Authorization: Bearer <license key>" on every request. Each card is sold separately; All-Access unlocks both.`
  };
}
