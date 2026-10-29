# Pricing

Three SKUs, sold through one checkout: Lemon Squeezy. Every other channel is free
distribution. A licence is a Lemon Squeezy key; the server resolves it over HTTP
(`Authorization: Bearer <key>`) or from `PRO_LICENSE_KEY` on stdio.

## Products

| SKU | Gross price | Pro tools unlocked | Core tools |
| --- | --- | --- | --- |
| **Card 1 — FluentCart Pro Agent** | $12/mo | `fc_generate_payment_gateway_boilerplate` | all 5 |
| **Card 2 — Lemon Squeezy Developer Agent** | $12/mo | `ls_verify_webhook`, `ls_validate_license` | all 5 |
| **All-Access** | $19/mo | all 3 | all 5 |

### Live SKUs (FastrSoft store `428520`, published 2026-10-28)

| SKU | Product id | Variant id | Checkout |
| --- | --- | --- | --- |
| All-Access Suite | `1479567` | `2306572` | <https://fastrsoft.lemonsqueezy.com/all-access-suite> |
| FluentCart Pro Agent | `1479582` | `2306601` | <https://fastrsoft.lemonsqueezy.com/fluentcart-pro-agent> |
| Lemon Squeezy Developer Agent | `1479604` | `2306630` | <https://fastrsoft.lemonsqueezy.com/lemon-squeezy-developer-agent> |

All three are monthly subscriptions with licence keys enabled; verified by
`scripts/sync-lemon-squeezy-ids.mjs` against the live API. Hosted checkout:
`https://fastrsoft.lemonsqueezy.com/checkout/buy/<variant_id>`.

Core tools are always free, on every SKU and with no key at all: `fc_search_hooks`,
`fc_get_db_schema`, `ls_search_docs`, `ls_get_schema`, `suite_get_pro_info`.

All-Access is the intended purchase: $19 buys what $24 would cost as two cards.
Two cards exist to give a single-framework developer a cheaper entry point and to
make the upsell visible inside the product (`suite_get_pro_info` names the tools
the current key does not unlock).

## One checkout, free distribution everywhere else

Lemon Squeezy is the only payment gateway. Every other channel is free
distribution: the product is identical, and a licence is always a Lemon Squeezy
key.

| Channel | Role | Price to buyer | Platform cut |
| --- | --- | --- | --- |
| Lemon Squeezy | the only checkout; issues every licence key | $12 / $12 / $19 per month | merchant-of-record fee only |
| MCPize | hosting and discovery | free | none |
| Smithery | public registry | free | none (sunset **2026-10-31**) |
| Apify | discovery | free | none |
| Agensi | skill-pack discovery | free | none |
| npm | `fastr-mcp-suite` binary | free | none |
| GitHub | skills source and issues | free | none |

Why one checkout: a single merchant of record, one place for tax, refunds, dunning
and cancellation, and one entitlement source. No split payouts, no per-platform
billing, and `meta.product_id` from one store is the only thing the server has to
resolve.

The trade-off: a buyer who finds the suite on MCPize leaves the listing, subscribes
on Lemon Squeezy, then pastes the key back into their MCPize client config. Expect
drop-off at that hand-off — that is the cost of a single checkout.

That hand-off does not work today: MCPize rejects a Lemon Squeezy key at its edge
before the container ever sees it. See "MCPize requires its own credential" below.

Two consequences for the build:

- **MCPize is hosting and identity, not billing.** Railway sign-up is closed, so
  the suite deploys to MCPize directly (`runtime: typescript` in `mcpize.yaml`;
  MCPize builds and runs the server itself, so `server/Dockerfile` is only for
  local runs and image-based hosts). Publishing `--free` removed the payment gate,
  not MCPize's own access gate — see the next section.
- **Apify is discovery, not a checkout.** If it is listed at all it is free, and it
  still needs the `ACTOR_WEB_SERVER_PORT` (4321) and `webServerMcpPath: /mcp`
  wiring before the image runs there.

Do not publish a fee number in this table from memory. The Lemon Squeezy
merchant-of-record rate changes by plan and region — read it from the dashboard
before quoting a net figure anywhere.

## MCPize requires its own credential

Probed against the live endpoint on **2026-10-29**:

| Request | Response |
| --- | --- |
| no auth header | `Authentication required for hosted servers. Please sign in to MCPize.` |
| `Authorization: Bearer <junk>` | `Valid MCPize authentication required for hosted servers.` |
| `X-MCP-License-Key: <junk>` | `Authentication required for hosted servers. Please sign in to MCPize.` |

Three things follow.

1. **A free listing is free of billing, not of identity.** `mcpize publish --free`
   removed the payment requirement. MCPize still demands an MCPize-issued
   credential before it forwards anything to the container.
2. **A Lemon Squeezy key sent as `Authorization: Bearer <key>` is parsed by MCPize
   as an MCPize key.** It fails at the edge and never reaches `server/src/http.ts`,
   so the "buy on Lemon Squeezy, paste the key back" flow does not work.
3. **The install snippet MCPize generates does not match the server.** It emits:

   ```bash
   claude mcp add --transport http fastr-mcp-suite https://fastr-mcp-suite.mcpize.run \
     --header "X-MCP-License-Key: <value>"
   ```

   but `authenticateRequest` reads only `authorization`:

   ```ts
   const token = bearerToken(request?.headers.get('authorization'));
   if (!token) return { tier: 'core', cards: [], source: 'none', reason: 'no Authorization header' };
   ```

   and never looks at `x-mcp-license-key`.

The likely outcome, unverified: the hosted listing serves the 5 core tools to every
authenticated MCPize client and the 3 Pro tools to nobody. Do not quote the hosted
path as an unlock until it is tested with a real MCPize account token and the
header that actually arrives at the container is recorded. The fix is a fallback
read for that header in `authenticateRequest`, added only once the header name is
confirmed on the wire.

`MCPIZE_GATEWAY_SECRET` is not that fix. It compares one shared string and grants
both cards to whoever presents it, so it can only ever prove "this request came
through the gateway", never which card the buyer paid for.

## Per-card entitlements in code

Implemented in `server/src/auth.ts`. A session's entitlement is a set of cards,
not a single tier:

1. `AuthContext.cards: CardId[]` where `CardId = 'fluentcart' | 'lemonsqueezy'`.
   `tier` is derived: any card makes the session `pro`, no cards is `core`.
2. The Lemon Squeezy validate response's `meta.product_id` is mapped through
   `LS_PRODUCT_ALL_ACCESS`, `LS_PRODUCT_FLUENTCART` and `LS_PRODUCT_LEMONSQUEEZY`.
   A valid licence whose product matches none of them is core.
3. Tool registration filters on `hasCard(auth, card)`, so a Pro tool the buyer did
   not pay for is never registered — the schema never reaches the client.
4. `suite_get_pro_info` reports `cards` and marks every Pro tool `unlocked: true`
   or `false`, naming the locked ones in its `unlock` copy.

Covered by `npm run verify` (per-card and fail-closed cases in
`server/scripts/verify-stdio.mjs`).

The three `LS_PRODUCT_*` ids are **defaulted in `server/src/auth.ts`** to the
published FastrSoft SKUs, so the mapping holds with no deploy-time configuration
at all — MCPize's free plan allows one secret per server, which is why the ids
are constants rather than required env. Every `LS_*` variable still overrides its
default for a self-hosted or white-label deployment.

Consequence: a card key unlocks only its own card. `4531…`-style unmapped
products (e.g. the existing Nexus Radar product) resolve to core.

## Agensi is a free listing

Resolved: the skill packs publish at $0.

The skills (`skills/fluentcart-developer`, `skills/lemonsqueezy-developer`) are
MIT and public on GitHub, so charging for the ZIP would sell files a buyer can
clone. A convenience bundle would also undercut the positioning that the paid
product is the *tools*, not the documentation. Agensi is discovery for the Lemon
Squeezy checkout and nothing more.
