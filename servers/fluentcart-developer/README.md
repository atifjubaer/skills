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

| Tool |
|------|
| `fc_search_hooks` |
| `fc_get_db_schema` |
| `fc_get_reference` |
| `fc_generate_payment_gateway_boilerplate` |
| `fc_generate_licensing_boilerplate` |
| `fc_generate_customer_endpoint_boilerplate` |
| `fc_generate_device_licensing_boilerplate` |
| `fc_generate_trial_guard_boilerplate` |
| `fc_generate_client_sdk` |
| `fc_generate_native_client` |
| `get_info` |

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
