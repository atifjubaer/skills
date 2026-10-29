---
name: "fastr-mcp-suite"
description: "Install, connect, and operate the Fastr MCP Suite server (fastr-dev-suite) — executable FluentCart and Lemon Squeezy tools over MCP. Use this skill when wiring the server into Claude Code, Claude Desktop, Cursor, Windsurf, Cline, Zed, or a hosted HTTP client; when deciding which fc_, ls_, or suite_ tool answers a question; when a Pro tool is missing; or when a license key does not unlock a card."
summary: "Setup and tool guide for the Fastr MCP Suite: install commands for every MCP client, the eight tools and their arguments, tier gating, and fixes for the failures people actually hit."
version: "1.0.0"
license: "BSL-1.1"
tags:
  - mcp
  - model-context-protocol
  - fluentcart
  - lemonsqueezy
  - developer-tools
keywords:
  - mcp server
  - fastr-mcp-suite
  - fastr-dev-suite
  - claude code mcp
  - fluentcart tools
  - lemon squeezy tools
use_cases:
  - Connecting the Fastr MCP Suite to an MCP client
  - Choosing the right fc_ or ls_ tool for a question
  - Unlocking and troubleshooting Pro tier tools
  - Running the suite locally, over stdio, or as a hosted HTTP service
---

# Fastr MCP Suite — Setup & Tool Guide

The MCP server turns the two knowledge-base skills into **callable tools**, so an agent fetches the one hook, table, or schema it needs instead of loading 239 KB of markdown into context.

- **Server name reported to clients:** `fastr-dev-suite`
- **npm package:** `fastr-mcp-suite` (bin: `fastr-mcp`)
- **Runtime:** Node.js **22 or newer**
- **Transports:** `stdio` (local clients), Streamable HTTP (hosted / marketplace)
- **Tools:** 8 total — 5 always available, 3 behind a license key

> This is a knowledge and verification server. It does not connect to a WordPress database and does not modify a FluentCart store. The one tool that reaches the network is `ls_validate_license`, which calls the Lemon Squeezy licensing API.

---

## 1. Install

Pick exactly one path. Do not mix a global install with an `npx` config.

### Claude Code (CLI)

```bash
claude mcp add fastr-suite -- npx -y fastr-mcp-suite
```

With a Pro key:

```bash
claude mcp add fastr-suite -e PRO_LICENSE_KEY=your-license-key -- npx -y fastr-mcp-suite
```

### Claude Desktop, Cursor, Windsurf, Cline, Zed

Add to the client's MCP config file (`claude_desktop_config.json`, `.cursor/mcp.json`, `mcp_config.json`, …):

```json
{
  "mcpServers": {
    "fastr-suite": {
      "command": "npx",
      "args": ["-y", "fastr-mcp-suite"],
      "env": {
        "PRO_LICENSE_KEY": "your-license-key"
      }
    }
  }
}
```

On Windows, if `npx` is not on the client's PATH, use `"command": "cmd"` with `"args": ["/c", "npx", "-y", "fastr-mcp-suite"]`.

### From a source checkout

```bash
cd server
npm ci
npm run build     # tsc + bundles both card skill folders into dist/skills
npm run verify    # 27 protocol assertions; all must pass
```

```json
{
  "mcpServers": {
    "fastr-suite": {
      "command": "node",
      "args": ["/absolute/path/to/server/dist/index.js"]
    }
  }
}
```

### Hosted (Streamable HTTP)

```bash
cd server && npm run build && node dist/http.js   # http://0.0.0.0:8080/mcp
```

- `POST /mcp` — MCP endpoint (Streamable HTTP)
- `GET /health` — liveness probe
- `PORT` — override the default `8080`

Send the license key per request: `Authorization: Bearer <license-key>`. A hosted deployment also accepts marketplace gateway secrets (`MCPIZE_GATEWAY_SECRET`, `AGENSI_GATEWAY_SECRET`) and an operator allowlist (`VALID_LICENSE_KEYS`, comma-separated).

---

## 2. Confirm the connection before doing real work

1. List the tools the client sees. Expect **5** on a free session, **6–8** with a key.
2. Call `suite_get_pro_info` with `{"card": "all"}`. It returns which Pro tools are unlocked, which are locked, and why.
3. Call one cheap read tool, e.g. `fc_search_hooks` with `{"query": "order_created"}`.

If any of those three fail, fix the connection first — no amount of prompt wording repairs a misconfigured server.

---

## 3. Tool routing

| The user asks about | Call |
| --- | --- |
| A FluentCart hook name, when it fires, its arguments | `fc_search_hooks` |
| A `wp_fct_*` table, its columns, the Eloquent model | `fc_get_db_schema` |
| Lemon Squeezy webhook signatures, checkout payloads, subscription states, license endpoints | `ls_search_docs` |
| The exact JSON:API body for a Lemon Squeezy endpoint | `ls_get_schema` |
| What is locked and how to unlock it | `suite_get_pro_info` |
| Generating a full FluentCart gateway class | `fc_generate_payment_gateway_boilerplate` *(Pro)* |
| Checking an HMAC signature against a raw payload | `ls_verify_webhook` *(Pro)* |
| Validating a customer's license key live | `ls_validate_license` *(Pro)* |

If a Pro tool is not registered, do **not** substitute a hand-written answer and present it as verified. Say which card is locked, and either use the free search tools or ask for a key.

---

## 4. Core tools (always available)

### `fc_search_hooks`

```json
{ "query": "checkout_validate" }
```

Searches all action and filter hook references. `query` is a case-insensitive substring matched against hook names and their surrounding lines.

Returns up to six matches, each as a headed block with a fenced PHP snippet. Use the exact hook name from the result — FluentCart matches hook names literally, including the `fluent_cart/` prefix.

### `fc_get_db_schema`

```json
{ "table": "orders" }
```

Returns the schema section for one table: columns, types, keys, and the matching Eloquent model.

Well-known tables: `orders`, `customers`, `subscriptions`, `order_items`, `licenses`, `coupons`. An unknown name returns a "not found" message listing those six — re-run with one of them rather than guessing a `wp_fct_` prefix variant.

### `ls_search_docs`

```json
{ "query": "webhook signature", "category": "webhooks" }
```

`category` is one of `webhooks`, `checkouts`, `subscriptions`, `licensing`, `all` (default `all`). Restricting the category is faster and returns tighter snippets.

Reach for this first for "how does X work"; reach for `ls_get_schema` when the user needs the exact request body.

### `ls_get_schema`

```json
{ "endpoint": "checkouts" }
```

`endpoint` must be one of: `checkouts`, `orders`, `subscriptions`, `license-keys`, `customers`, `products`, `variants`, `webhooks`.

Returns the endpoint path, the JSON:API content type, and a payload skeleton with the required relationships. Use it verbatim; Lemon Squeezy rejects bodies with the wrong `type` or a missing `relationships` block.

### `suite_get_pro_info`

```json
{ "card": "all" }
```

`card` is `all` (default), `fluentcart`, or `lemonsqueezy`. Read-only. This is the authoritative answer to "why can't I see that tool" — call it before speculating about a client bug.

---

## 5. Pro tools (require a license key)

### `fc_generate_payment_gateway_boilerplate` — Card 1

```json
{
  "gatewaySlug": "quickpay",
  "gatewayTitle": "QuickPay",
  "supportsSubscriptions": false
}
```

`gatewaySlug` must be lowercase with underscores. Returns a complete PHP gateway: the `fluent_cart/payment_methods` registration, the gateway class, the settings schema, and the webhook listener. It is a starting point — the remote API calls, credentials, and status mapping still need the gateway's own documentation.

### `ls_verify_webhook` — Card 2

```json
{
  "rawBody": "{\"meta\":{\"event_name\":\"order_created\"}}",
  "signatureHeader": "hex-signature-from-x-signature",
  "signingSecret": "your-webhook-signing-secret"
}
```

Compares an HMAC-SHA256 digest against the header in constant time. `rawBody` must be the **unparsed** request body — a re-serialized object will fail even when the signature is genuine. The secret belongs in an environment variable; never paste it into a conversation that will be stored.

### `ls_validate_license` — Card 2

```json
{ "licenseKey": "XXXX-XXXX-XXXX-XXXX", "instanceId": "optional-instance-id" }
```

Calls `https://api.lemonsqueezy.com/v1/licenses/validate` and returns the raw response, including `valid`, `license_key.status`, `meta.product_id`, and `meta.store_id`. Omit `instanceId` to check the key itself; include it to check one activated machine or domain.

---

## 6. Tiers and license keys

A **card** is one product. A session gets the Pro tools of the cards its key is entitled to.

| Session | Tools registered |
| --- | --- |
| No key (`core`) | The 5 core tools + the skills catalog |
| Card 1 key | All core tools + `fc_generate_payment_gateway_boilerplate` |
| Card 2 key | All core tools + `ls_verify_webhook`, `ls_validate_license` |
| All-Access key | All 8 |

How the key is presented depends on the transport:

- **stdio** — `PRO_LICENSE_KEY` in the environment.
- **HTTP** — `Authorization: Bearer <key>` on each request.

Validation results are cached for 10 minutes. A revoked key therefore keeps working for up to 10 minutes, and a newly purchased key is picked up immediately on the next cache miss.

`PRO_CARDS` exists so a local session can be narrowed to one card for testing (`PRO_CARDS=fluentcart`). An unrecognised value fails closed to `core`.

---

## 7. Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Pro tool "not found" | Pro tools are never registered on a locked session — the schema is not sent to the client | `suite_get_pro_info` to confirm the tier, then check `PRO_LICENSE_KEY` / the Bearer header |
| Key is valid but only some cards unlock | The key's `meta.product_id` maps to a single card | Expected. Use an All-Access key for both |
| `license inactive, unknown, or wrong store` | Key revoked, expired, or from a different store | `LS_STORE_ID` overrides the expected store; the default is the FastrSoft store |
| `license validation unavailable` | Lemon Squeezy API unreachable or timed out (5 s) | Fails closed to core by design; retry, and check outbound network |
| `fc_get_db_schema` says "not found" | Unknown table name | Re-run with `orders`, `customers`, `subscriptions`, `order_items`, `licenses`, or `coupons` |
| Server exits immediately under `npx` on Windows | Piped stdin is not a real MCP client session; `npx` swallows stdio | Not a server bug — test through an actual client, or install into a temp dir and spawn `node node_modules/fastr-mcp-suite/dist/index.js` |
| `Cannot find module` after a global install | Node older than 22, or a stale global cache | `node -v`, then `npm cache clean --force` and reinstall |
| Client sees zero tools | Wrong command or working directory in the config | Run the exact command from the config in a terminal first |

---

## 8. Rules for the agent

1. **Search before answering.** For any FluentCart hook or table, or any Lemon Squeezy endpoint, call the tool first. A remembered answer is not evidence.
2. **One tool, one question.** Pass a short query, read the snippet, then call again with a tighter term if the result missed.
3. **Quote hook names and payload skeletons verbatim** from tool output. Do not reformat them.
4. **Never fabricate a Pro result.** If a locked tool is missing, say so and name the card that unlocks it.
5. **Report tool errors as they are.** If a tool returns `isError`, surface the message and the fix — do not paper over it with a guess.
6. **Keep secrets out of transcripts.** License keys and webhook signing secrets go in environment variables, not in tool arguments that a chat log will persist.
