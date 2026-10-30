# Pricing & Distribution

## Price: free

The suite has no paid tier. The server ([`server/`](../server/README.md)) and the
skills ([`skills/`](../skills)) are MIT, every tool is registered for every
caller, and there is nothing to buy, unlock, or renew.

That decision was made on **2026-10-30** and replaced an earlier three-SKU
subscription model ($12 / $12 / $19 per month through Lemon Squeezy). The
commercial scaffolding — licence validation, the store/product id map, the
`VALID_LICENSE_KEYS` allowlist, gateway secrets, and the `X-MCP-License-Key`
header — was removed with it.

Why free:

- **The gate cost more than it earned.** Every licensing path was a failure mode:
  a revoked key that kept working for the cache TTL, a Card 1 key that silently
  did not unlock Card 2, an outage that failed closed to a tier the buyer had
  already paid for. None of that exists now.
- **The distribution was already free.** MCPize, Smithery, Apify, Agensi, npm and
  GitHub never charged for placement, so the only revenue was the key itself.
- **The moat is the documentation, not the binary.** Both skills are public
  anyway; charging for the tool layer that reads them invited forks rather than
  customers.
- **Open source is the growth loop.** A developer who finds a wrong hook can send
  a pull request instead of filing a support ticket.

## Channels

| Channel | Role | Cost |
| --- | --- | --- |
| npm | `fastr-mcp-suite` binary — the install line in every guide | free |
| GitHub | source, issues, pull requests | free |
| MCPize | hosted Streamable HTTP endpoint + discovery | free |
| Smithery | public registry | free (sunset **2026-10-31**) |
| Apify | discovery | free |
| Agensi | skill-pack discovery | free |

### MCPize is hosting and identity, not billing

`mcpize publish --free` removes the payment requirement but not MCPize's own
access gate. Probed against the live endpoint on **2026-10-29**:

| Request | Response |
| --- | --- |
| no auth header | 401 `Authentication required for hosted servers. Please sign in to MCPize.` |
| `Authorization: Bearer <junk>` | 401 `Valid MCPize authentication required for hosted servers.` |
| `Authorization: Bearer <MCPize session token>` | 200 — the request reaches the container |

So a caller still needs an MCPize-issued credential to use the hosted endpoint,
even though the server itself asks for nothing. That credential is the
marketplace's, not ours: `server/src/http.ts` ignores every header and registers
the same ten tools either way. Anyone who wants zero intermediaries can run
`npx -y fastr-mcp-suite` locally, or self-host the HTTP transport.

### Apify is discovery, not a checkout

If it is listed at all it is free, and it still needs the
`ACTOR_WEB_SERVER_PORT` (4321) and `webServerMcpPath: /mcp` wiring before the
image runs there.

## What this means for the docs

Any sentence that mentions a licence key, a checkout URL, a tier, or a
`PRO_LICENSE_KEY` is stale. The current install instruction is one line:

```bash
claude mcp add fastr-suite -- npx -y fastr-mcp-suite
```
