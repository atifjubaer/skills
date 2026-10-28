# Pricing

Three SKUs, sold at the same gross price on every channel. A licence is a Lemon
Squeezy key; the server resolves it over HTTP (`Authorization: Bearer <key>`) or
from `PRO_LICENSE_KEY` on stdio.

## Products

| SKU | Gross price | Pro tools unlocked | Core tools |
| --- | --- | --- | --- |
| **Card 1 — FluentCart Pro Agent** | $12/mo | `fc_generate_payment_gateway_boilerplate` | all 5 |
| **Card 2 — Lemon Squeezy Developer Agent** | $12/mo | `ls_verify_webhook`, `ls_validate_license` | all 5 |
| **All-Access** | $19/mo | all 3 | all 5 |

Core tools are always free, on every SKU and with no key at all: `fc_search_hooks`,
`fc_get_db_schema`, `ls_search_docs`, `ls_get_schema`, `suite_get_pro_info`.

All-Access is the intended purchase: $19 buys what $24 would cost as two cards.
Two cards exist to give a single-framework developer a cheaper entry point and to
make the upsell visible inside the product (`suite_get_pro_info` names the tools
the current key does not unlock).

## Channel parity

Gross price is identical everywhere; what differs is the platform's cut. Verified
against each platform's own docs on 2026-10-28:

| Channel | Gross | Platform fee | Net before tax | Notes |
| --- | --- | --- | --- | --- |
| Lemon Squeezy (direct) | $19 | merchant-of-record fee | _unverified_ | also issues the licence keys |
| MCPize | $19 | 20% (80/20 split) | $15.20 | paid traffic is proxied through their gateway (`MCPIZE_GATEWAY_SECRET`); hosting Free / $9 / $29 / $79 |
| Smithery | — | none — no monetization program | $0 | proxy, API, CLI and accounts shut down **2026-10-31**; free discovery only |
| Apify | $19 | 20% + platform usage costs | _varies_ | pay-per-event only; needs `ACTOR_WEB_SERVER_PORT` (4321) and Standby `webServerMcpPath: /mcp` |
| Agensi | per skill pack, not the $19 server | 30% (70/30 split) | depends on pack price | skills only; Stripe Connect pays in 2–7 days |

Two consequences for the build:

- **MCPize is both the host and the only channel with real billing.** Railway
  sign-up is closed, so the suite deploys to MCPize directly
  (`runtime: container`, `build.dockerfile: server/Dockerfile` in
  `mcpize.yaml`). MCPize revenue bypasses the Lemon Squeezy checkout — Lemon
  Squeezy stays the direct-sales and licence-issuing channel, and direct buyers
  paste their key as the `LICENSE_KEY` credential on MCPize.
- **Apify needs a code change before it can host this image**: the server listens
  on `PORT || 8080`, Apify requires `ACTOR_WEB_SERVER_PORT` (default 4321) and a
  readiness probe on `GET /`. Railway injects `PORT`, so it needs nothing.

Do not publish a number in this table from memory. Each one gets filled from the
platform's own docs before the listing goes live.

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

**Before the two $12 SKUs go live**, set the three `LS_PRODUCT_*` ids in the
deploy environment. With none set — today's state — any valid licence unlocks
both cards, so the cards are not actually separable yet; only All-Access is
correct to sell until that mapping exists.

## Open question — what Agensi sells

The skills (`skills/fluentcart-developer`, `skills/lemonsqueezy-developer`) are
MIT and public on GitHub, and the README says they stay that way for discovery and
`skills.sh` indexing. Agensi sells skill packs, which means listing MIT content
someone can clone for free.

Three ways to resolve it, and this needs a decision before the Agensi listing:

- **Free listing** — publish at $0 as discovery, converting to the paid MCP server.
  Costs nothing and cannot cannibalise anything.
- **Convenience bundle** — charge a small one-time price for the packaged ZIP. Allowed
  under MIT, but a buyer can get the same files from the repo.
- **Paid skills** — move the skills off MIT and behind a licence. Contradicts the
  current README, the `LICENSE` file and the "MIT stays public" claim, so it is a
  positioning change, not a pricing tweak.
