---
name: "fastr-mcp-suite"
description: "Install, connect, and operate the Fastr MCP Suite server (fastr-dev-suite) — free, MIT-licensed FluentCart and Lemon Squeezy tools over MCP. Use this skill when wiring the server into Claude Code, Claude Desktop, Cursor, Windsurf, Cline, Zed, or a hosted HTTP client; when deciding which fc_, ls_, or suite_ tool answers a question; or when a tool call fails."
summary: "Setup and tool guide for the Fastr MCP Suite: install commands for every MCP client, all ten tools and their arguments, and fixes for the failures people actually hit. Every tool is free."
version: "2.0.0"
license: "MIT"
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
  - Running the suite locally, over stdio, or as a hosted HTTP service
  - Diagnosing a failing tool call
---

# Fastr MCP Suite — Setup & Tool Guide

The MCP server turns the two knowledge-base skills into **callable tools**, so an agent fetches the one hook, table, or schema it needs instead of loading 239 KB of markdown into context.

- **Server name reported to clients:** `fastr-dev-suite`
- **npm package:** `fastr-mcp-suite` (bin: `fastr-mcp`)
- **Runtime:** Node.js **22 or newer**
- **Transports:** `stdio` (local clients), Streamable HTTP (hosted / marketplace)
- **Tools:** 10 total — all free, all registered for every caller
- **Licence:** MIT. No key, no account, no quota.

> This is a knowledge and verification server. It does not connect to a WordPress database and does not modify a FluentCart store. The one tool that reaches the network is `ls_validate_license`, which calls the Lemon Squeezy licensing API.

---

## 1. Install

Pick exactly one path. Do not mix a global install with an `npx` config.

### Claude Code (CLI)

```bash
claude mcp add fastr-suite -- npx -y fastr-mcp-suite
```

### Claude Desktop, Cursor, Windsurf, Cline, Zed

Add to the client's MCP config file (`claude_desktop_config.json`, `.cursor/mcp.json`, `mcp_config.json`, …):

```json
{
  "mcpServers": {
    "fastr-suite": {
      "command": "npx",
      "args": ["-y", "fastr-mcp-suite"]
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
npm run verify    # boots the built server; all checks must pass
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

No `Authorization` header is required. A gateway in front of the server may authenticate callers for its own purposes, but the server ignores that credential and registers the same ten tools either way.

---

## 2. Confirm the connection before doing real work

1. List the tools the client sees. Expect **10**.
2. Call `suite_get_info` with `{}`. It reports the transport, the tools per card, and the licence.
3. Call one cheap read tool, e.g. `fc_search_hooks` with `{"query": "order_created"}`.

If any of those three fail, fix the connection first — no amount of prompt wording repairs a misconfigured server.

---

## 3. Tool routing

| The user asks about | Call |
| --- | --- |
| A FluentCart hook name, when it fires, its arguments | `fc_search_hooks` |
| A `wp_fct_*` table, its columns, the Eloquent model | `fc_get_db_schema` |
| A FluentCart REST endpoint, model columns, gateway guide, module notes — anything past the four lookups above | `fc_get_reference` |
| Lemon Squeezy webhook signatures, checkout payloads, subscription states, license endpoints | `ls_search_docs` |
| The exact JSON:API body for a Lemon Squeezy endpoint | `ls_get_schema` |
| A Lemon Squeezy guide read in full or by section | `ls_get_reference` |
| What this server contains and how it is licensed | `suite_get_info` |
| Generating a full FluentCart gateway class | `fc_generate_payment_gateway_boilerplate` |
| Generating FluentCart Software Licensing SDK integration boilerplate | `fc_generate_licensing_boilerplate` |
| Checking an HMAC signature against a raw payload | `ls_verify_webhook` |
| Validating a customer's license key live | `ls_validate_license` |

If a tool is not registered, the server is running an old build — reinstall (see §6). Do **not** substitute a hand-written answer and present it as verified.

---

## 4. Tools

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

### `fc_get_reference`

```json
{ "file": "rest-api-subscriptions.md", "section": "Void Renewal Invoice" }
```

Opens any file under `skills/fluentcart-developer/references/`. Omit **both** arguments to list all 49 files with their size and title; pass `file` alone to read the whole document (capped at 14,000 characters — a truncation note says so); add `section` to pull a single `##`/`###` heading instead.

Use it for everything `fc_search_hooks` and `fc_get_db_schema` do not answer: REST endpoints (`rest-api-*.md`), every model's columns (`models-complete-index.md`), the deprecated hook tables (`hooks-complete-index.md`), payment gateways, modules, fees, engineering notes.

An unknown file name that matches one real file loosely is resolved for you; anything ambiguous returns the candidate list rather than a guess. Path traversal is rejected, so pass a plain file name.

### `fc_generate_payment_gateway_boilerplate`

```json
{
  "gatewaySlug": "quickpay",
  "gatewayTitle": "QuickPay",
  "supportsSubscriptions": false
}
```

`gatewaySlug` must be lowercase with underscores. Returns a complete PHP gateway: the `fluent_cart/payment_methods` registration, the gateway class, the settings schema, and the webhook listener. It is a starting point — the remote API calls, credentials, and status mapping still need the gateway's own documentation.

### `fc_generate_licensing_boilerplate`

```json
{
  "pluginNamespace": "Acme\\AwesomePlugin",
  "pluginTitle": "Awesome Plugin Pro",
  "itemId": 42,
  "apiUrl": "https://store.example.com/",
  "includeAdminUi": true
}
```

Generates production-ready client integration PHP code for third-party WordPress plugins and themes using the official FluentCart Software Licensing SDK (`fluent-cart/software-licensing-sdk`). Emits the `FluentLicensing` registration, license status check helpers, and turnkey Admin License Management settings page (`LicenseSettings`).

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

### `ls_get_reference`

```json
{ "file": "webhooks-and-security.md", "section": "Webhook Event Catalog" }
```

Same contract as `fc_get_reference`, over the 7 Lemon Squeezy reference files: `developer-guide.md`, `api-reference.md`, `checkouts-and-orders.md`, `subscriptions-lifecycle.md`, `license-keys-and-activation.md`, `webhooks-and-security.md`, `go-live-guide.md`.

Omit both arguments to list them; pass `file` for the whole document; add `section` for one heading. Reach for it when `ls_search_docs` returns a snippet that stops short of what the user needs.

### `ls_verify_webhook`

```json
{
  "rawBody": "{\"meta\":{\"event_name\":\"order_created\"}}",
  "signatureHeader": "hex-signature-from-x-signature",
  "signingSecret": "your-webhook-signing-secret"
}
```

Compares an HMAC-SHA256 digest against the header in constant time. `rawBody` must be the **unparsed** request body — a re-serialized object will fail even when the signature is genuine. The secret belongs in an environment variable; never paste it into a conversation that will be stored.

### `ls_validate_license`

```json
{ "licenseKey": "XXXX-XXXX-XXXX-XXXX", "instanceId": "optional-instance-id" }
```

Calls `https://api.lemonsqueezy.com/v1/licenses/validate` and returns the raw response, including `valid`, `license_key.status`, `meta.product_id`, and `meta.store_id`. Omit `instanceId` to check the key itself; include it to check one activated machine or domain.

Results are cached for 60 seconds and bounded to 32 concurrent calls, so repeated checks during one investigation are cheap.

### `suite_get_info`

```json
{ "card": "all" }
```

`card` is `all` (default), `fluentcart`, or `lemonsqueezy`. Read-only. Reports the transport this call arrived on, the tool list per card, the licence (MIT), and the price (`free`).

---

## 5. Free means free

There is no tier, no licence key, no purchase, and no request cap. Every tool above is registered for every client on both transports, including the three that used to sit behind a key (`fc_generate_payment_gateway_boilerplate`, `ls_verify_webhook`, `ls_validate_license`).

If a config still carries `PRO_LICENSE_KEY` or `PRO_CARDS` from an older install, delete them — they are ignored, and leaving them behind makes the next reader think a gate exists.

The server and these skills are MIT. Fork the repo, run your own copy, and open a pull request for anything you want upstream.

---

## 6. Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| A tool is "not found" | An older build predates it, or the client cached an old tool list | Reinstall (`npx -y fastr-mcp-suite`) and restart the client so it re-runs `tools/list` |
| Client sees zero tools | Wrong command or working directory in the config | Run the exact command from the config in a terminal first |
| `fc_get_db_schema` says "not found" | Unknown table name | Re-run with `orders`, `customers`, `subscriptions`, `order_items`, `licenses`, or `coupons` |
| `fc_get_reference` returns a candidate list | The file name matched more than one file | Re-run with one of the names it printed |
| Reference text looks truncated | The whole-document read is capped at 14,000 characters | Re-run with `section` to pull one heading |
| `license validation unavailable` | Lemon Squeezy API unreachable or timed out (5 s) | Retry; nothing else in the suite depends on it |
| `Lemon Squeezy validation concurrency limit reached` | More than 32 validations in flight | Retry in a moment |
| Server exits immediately under `npx` on Windows | Piped stdin is not a real MCP client session; `npx` swallows stdio | Not a server bug — test through an actual client, or install into a temp dir and spawn `node node_modules/fastr-mcp-suite/dist/index.js` |
| `Cannot find module` after a global install | Node older than 22, or a stale global cache | `node -v`, then `npm cache clean --force` and reinstall |

---

## 7. Rules for the agent

1. **Search before answering.** For any FluentCart hook or table, or any Lemon Squeezy endpoint, call the tool first. A remembered answer is not evidence.
2. **One tool, one question.** Pass a short query, read the snippet, then call again with a tighter term if the result missed.
3. **Quote hook names and payload skeletons verbatim** from tool output. Do not reformat them.
4. **Report tool errors as they are.** If a tool returns `isError`, surface the message and the fix — do not paper over it with a guess.
5. **Keep secrets out of transcripts.** Webhook signing secrets and customer licence keys go in environment variables, not in tool arguments that a chat log will persist.
6. **Never invent a tool that is missing.** If the client does not list a tool the user asked for, say the installed build is out of date and give the reinstall command.
