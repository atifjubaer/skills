# Fastr MCP Suite

One MCP server that ships the Playing Cards — **FluentCart Developer Agent** and **Lemon Squeezy Developer Agent** — as executable tools plus a skills catalog, so an agent pulls only the slice of documentation it needs instead of loading 239 KB of markdown into the context window.

**Free and MIT-licensed.** All ten tools are registered for every caller on every transport: no licence key, no account, no subscription, no request quota. Nothing in this server validates a purchase, because there is nothing to purchase.

Protocol: MCP `2026-07-28` (stateless, per-request `_meta` envelope) with a `2025-11-25` legacy fallback. Transports: `stdio` for local clients, Streamable HTTP for marketplaces and hosted deploys.

## Run it

### From npm

Published as [`fastr-mcp-suite`](https://www.npmjs.com/package/fastr-mcp-suite) — Node 22+, no clone and no build:

```bash
npx -y fastr-mcp-suite
```

Client config (Claude Code / Cursor / Windsurf):

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

```bash
claude mcp add fastr-suite -- npx -y fastr-mcp-suite
```

The npm package ships the stdio entry point only. The Streamable HTTP transport needs the source tree or the Docker image.

### From source

```bash
npm install
npm run build        # tsc + bundles both skill folders into dist/skills
npm run verify       # boots the built server and asserts the protocol surface
node dist/index.js   # stdio
node dist/http.js    # Streamable HTTP on :8080 (POST /mcp, GET /health)
```

Point a client at the built file:

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

## Tools

Ten tools, all free. `suite_get_info` reports the same list at runtime, scoped by card.

| Card | Tool | Answers |
| --- | --- | --- |
| FluentCart | `fc_search_hooks` | A hook name, when it fires, its arguments |
| FluentCart | `fc_get_db_schema` | A `wp_fct_*` table, its columns, the Eloquent model |
| FluentCart | `fc_get_reference` | Any of the 50 reference files, whole or by heading |
| FluentCart | `fc_generate_payment_gateway_boilerplate` | A complete PHP gateway class, settings schema and webhook entry point |
| FluentCart | `fc_generate_licensing_boilerplate` | Complete FluentCart Software Licensing SDK integration with automatic updates and admin UI |
| Lemon Squeezy | `ls_search_docs` | Webhook signatures, checkout payloads, subscription states |
| Lemon Squeezy | `ls_get_schema` | The exact JSON:API body for an endpoint |
| Lemon Squeezy | `ls_get_reference` | Any of the 7 Lemon Squeezy reference files, whole or by heading |
| Lemon Squeezy | `ls_verify_webhook` | Timing-safe HMAC-SHA256 check against a raw payload |
| Lemon Squeezy | `ls_validate_license` | A live licence key, validated against Lemon Squeezy's API |
| Suite | `suite_get_info` | What this server is, which tools serve which card, and its licence |

The skills catalog is attached as an MCP extension, so clients that understand it also get `skills/list` and `resources/read` over the same 64 files.

`ls_validate_license` is the only tool that reaches the network. It is cached for 60 s, bounded to 32 concurrent calls and times out at 5 s, so a public deploy does not become an unbounded relay into Lemon Squeezy's API.

## Deploy

### Docker

```bash
docker build -t fastr-mcp-suite .
docker run -p 8080:8080 -e ALLOWED_HOSTS=your-host.example fastr-mcp-suite
```

`ALLOWED_HOSTS` is the only environment variable worth setting: a comma-separated Host allowlist for DNS-rebinding protection. `PORT` overrides `8080`. Nothing else is read.

Any host that accepts a long-running HTTP process works — Railway, Render, Fly.io, a VPS. Mount `/health` as the liveness probe: it returns the protocol version, the card list and the licence.

### MCPize

[`mcpize.yaml`](../mcpize.yaml) at the repository root is the deployment manifest; `npx mcpize deploy` builds and publishes from there. MCPize authenticates callers at its own edge, but that credential no longer changes what the server registers — a caller with or without it sees the same ten tools.

## Not affiliated

This is an independent developer tool. It does not connect to a WordPress database, does not modify a FluentCart store, and is not published by either vendor. Documentation in `skills/` is compiled from their public references.

## Licence

MIT — see [`LICENSE.md`](./LICENSE.md). Fork it, host it, adapt it.
