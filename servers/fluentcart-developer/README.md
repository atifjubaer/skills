# fluentcart-developer

MCP server for FluentCart developer knowledge: documentation search, database schema lookup, hook discovery, reference reading, and boilerplate generation for gateways, licensing, customers, device licensing, trial guards and client SDKs.

Free and MIT-licensed. No licence key, account, or purchase required.

## Install

```json
{
  "mcpServers": {
    "fluentcart": {
      "command": "npx",
      "args": ["-y", "fluentcart-developer"]
    }
  }
}
```

## Tools

| Tool | What it does |
|------|--------------|
| `fc_search_hooks` | Search 680+ hooks by name or domain |
| `fc_get_db_schema` | Read one `wp_fct_*` table |
| `fc_get_reference` | Read one documentation page, or one heading inside it |
| `fc_generate` | Generate code — pass a `type`: `payment_gateway`, `licensing`, `customer_endpoint`, `device_licensing`, `trial_guard`, `client_sdk`, `native_client` |
| `get_info` | Server version, tool list and licence |

`fc_generate` replaces seven separate generator tools. Every registered tool's
description and input schema is injected into the model's prompt on every
request whether or not it is used, and those seven cost ~2,342 tokens per
request between them — the documentation corpus costs nothing by comparison,
because it is fetched on demand. Collapsing them into one tool took the
server's per-request baseline from ~2,809 tokens to ~1,823.

The `fluentcart-developer` skill is bundled inside the package, so the client can load it
over MCP without a separate checkout.

## HTTP transport

```bash
npx -y fluentcart-developer start:http
```

Listens on `PORT` (default `8080`). Set `ALLOWED_HOSTS` to a comma-separated
allowlist when running behind a proxy.

## Development

```bash
npm install
npm run build
npm run verify
```

`npm run verify` boots the built server over stdio exactly as an MCP client
does and asserts the handshake, the complete tool set, a real call against every
tool, and the modern-era discovery path. `prepublishOnly` runs it, so a broken
build cannot reach npm.
