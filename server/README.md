# Fastr MCP Suite

One MCP server that ships the Playing Cards — **FluentCart Pro Agent** and **Lemon Squeezy Developer Agent** — as executable tools plus a skills catalog, so an agent pulls only the slice of documentation it needs instead of loading 239 KB of markdown into the context window.

Protocol: MCP `2026-07-28` (stateless, per-request `_meta` envelope) with a `2025-11-25` legacy fallback. Transports: `stdio` for local clients, Streamable HTTP for marketplaces and hosted deploys.

## Run it

```bash
npm install
npm run build        # tsc + bundles both skill folders into dist/skills
npm run verify       # boots the built server and asserts the protocol surface
node dist/index.js   # stdio
node dist/http.js    # Streamable HTTP on :8080 (POST /mcp, GET /health)
```

Claude Code / Cursor / Windsurf:

```json
{
  "mcpServers": {
    "fastr-suite": {
      "command": "node",
      "args": ["/absolute/path/to/server/dist/index.js"],
      "env": { "PRO_LICENSE_KEY": "optional-license-key" }
    }
  }
}
```

## Tiers

| Tier | What is registered |
| --- | --- |
| `core` (free) | `ls_search_docs`, `ls_get_schema`, `fc_search_hooks`, `fc_get_db_schema`, `suite_get_pro_info`, plus `skills/list` and `resources/read` for both skills |
| `pro` (paid) | everything above **and** `ls_verify_webhook`, `ls_validate_license`, `fc_generate_payment_gateway_boilerplate` |

Pro tools are **not registered** on a core session — the schema never reaches the client, so there is nothing to call. `suite_get_pro_info` is the upgrade surface: it always answers with the current tier and what Pro adds.

How a tier is decided:

- **stdio** — `PRO_LICENSE_KEY` in the environment unlocks Pro. Convenience switch, not a security boundary.
- **HTTP** — every request carries `Authorization: Bearer <token>`:
  1. token in `VALID_LICENSE_KEYS` → Pro (ops/CI seats)
  2. equals `MCPIZE_GATEWAY_SECRET` → Pro (constant-time compare)
  3. equals `AGENSI_GATEWAY_SECRET` → Pro (constant-time compare)
  4. otherwise validated live against `https://api.lemonsqueezy.com/v1/licenses/validate`, cached 10 minutes, active status and store id checked. Any failure fails closed to core.

Copy [`.env.example`](./.env.example) to `.env` for the HTTP transport.

## Deploy

Docker (build from the **repository root** so the skill folders are in context):

```bash
docker build -f server/Dockerfile -t fastr-mcp-suite .
docker run -p 8080:8080 --env-file server/.env fastr-mcp-suite
```

Works as-is on Railway / Render / Fly.io / MCPize: the image serves `POST /mcp` and answers `GET /health` for the platform healthcheck.

### Smithery

Smithery publishes a **URL**, not a repo manifest — the old `smithery.yaml`/`smithery.json` format is gone. Deploy the image, then register the endpoint:

```bash
npx -y smithery mcp publish "https://<your-host>/mcp" -n <namespace>/fastr-mcp-suite \
  --config-schema "$(cat server/smithery.config.json)"
```

[`smithery.config.json`](./smithery.config.json) maps the user's licence key from the `ls-license-key` header onto upstream `Authorization`, which is exactly what the HTTP transport already reads. The field is optional, so a free user connects straight into the core tier.

## Layout

```
src/
  auth.ts                     tier resolution (stdio env + HTTP license validation)
  paths.ts                    skills folder resolution (bundled dist/skills → repo skills/)
  server.ts                   server factory, catalog attach, Pro info tool
  index.ts                    stdio entry
  http.ts                     Streamable HTTP entry + /health
  cards/lemonsqueezy/tools.ts Card 2 tools
  cards/fluentcart/tools.ts   Card 1 tools
scripts/
  copy-skills.mjs             bundles skills/* into dist/skills for npm
  verify-stdio.mjs            end-to-end protocol, tier-gating and era probe
```

Skill **content** is MIT and lives in the public repo under `skills/`. This server implementation is BSL-1.1 — see [LICENSE.md](./LICENSE.md).
