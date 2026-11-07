# lemonsqueezy-developer

MCP server for Lemon Squeezy developer knowledge: API documentation search, resource schema lookup, reference reading, webhook signature verification and licence-key validation.

Free and MIT-licensed. No licence key, account, or purchase required.

## Install

```json
{
  "mcpServers": {
    "lemonsqueezy": {
      "command": "npx",
      "args": ["-y", "lemonsqueezy-developer"]
    }
  }
}
```

## Tools

| Tool |
|------|
| `ls_search_docs` |
| `ls_get_schema` |
| `ls_get_reference` |
| `ls_verify_webhook` |
| `ls_validate_license` |
| `get_info` |

The `lemonsqueezy-developer` skill is bundled inside the package, so the client can load it
over MCP without a separate checkout.

## HTTP transport

```bash
npx -y lemonsqueezy-developer start:http
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
