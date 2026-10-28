# Fastr MCP Suite

One MCP server that ships the Playing Cards — **FluentCart Pro Agent** and **Lemon Squeezy Developer Agent** — as executable tools plus a skills catalog, so an agent pulls only the slice of documentation it needs instead of loading 239 KB of markdown into the context window.

Protocol: MCP `2026-07-28` (stateless, per-request `_meta` envelope) with a `2025-11-25` legacy fallback. Transports: `stdio` for local clients, Streamable HTTP for marketplaces and hosted deploys.

## Run it

### From npm

Published as [`fastr-mcp-suite`](https://www.npmjs.com/package/fastr-mcp-suite) — Node 22+, no clone and no build:

```bash
npx -y fastr-mcp-suite                             # stdio, core tools
PRO_LICENSE_KEY=your-key npx -y fastr-mcp-suite    # stdio, Pro tools unlocked
```

Client config (Claude Code / Cursor / Windsurf):

```json
{
  "mcpServers": {
    "fastr-suite": {
      "command": "npx",
      "args": ["-y", "fastr-mcp-suite"],
      "env": { "PRO_LICENSE_KEY": "optional-license-key" }
    }
  }
}
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
      "args": ["/absolute/path/to/server/dist/index.js"],
      "env": { "PRO_LICENSE_KEY": "optional-license-key" }
    }
  }
}
```

## Tiers

| Entitlement | What is registered |
| --- | --- |
| `core` (free) | `ls_search_docs`, `ls_get_schema`, `fc_search_hooks`, `fc_get_db_schema`, `suite_get_pro_info`, plus `skills/list` and `resources/read` for both skills |
| Card 1 — FluentCart Pro Agent | everything above **and** `fc_generate_payment_gateway_boilerplate` |
| Card 2 — Lemon Squeezy Developer Agent | everything above **and** `ls_verify_webhook`, `ls_validate_license` |
| All-Access | everything above **and** all three Pro tools |

A session's entitlement is a **set of cards** (`fluentcart`, `lemonsqueezy`), not a single on/off. One card makes the session paid; the other card's Pro tools are **not registered** — the schema never reaches the client, so there is nothing to call. `suite_get_pro_info` is the upgrade surface: it reports the session's cards and marks each Pro tool `unlocked`.

How entitlement is decided:

- **stdio** — `PRO_LICENSE_KEY` (16+ characters) unlocks both cards. Convenience switch, not a security boundary. `PRO_CARDS=fluentcart` or `PRO_CARDS=lemonsqueezy` (comma-separated for both) narrows the session; a value naming no known card fails closed to core.
- **HTTP** — every request carries `Authorization: Bearer <token>`:
  1. token in `VALID_LICENSE_KEYS` → both cards (ops/CI seats)
  2. equals `MCPIZE_GATEWAY_SECRET` → both cards (constant-time compare)
  3. equals `AGENSI_GATEWAY_SECRET` → both cards (constant-time compare)
  4. otherwise validated live against `https://api.lemonsqueezy.com/v1/licenses/validate`, cached 10 minutes, active status and store id checked. The response's `meta.product_id` is mapped to cards through `LS_PRODUCT_ALL_ACCESS`, `LS_PRODUCT_FLUENTCART` and `LS_PRODUCT_LEMONSQUEEZY`; a product that matches none of them is treated as core. With no `LS_PRODUCT_*` variable set, any valid key unlocks both cards (single-product behaviour). Any validation failure fails closed to core.

Copy [`.env.example`](./.env.example) to `.env` for the HTTP transport.

## Deploy

Docker (build from the **repository root** so the skill folders are in context):

```bash
docker build -f server/Dockerfile -t fastr-mcp-suite .
docker run -p 8080:8080 --env-file server/.env fastr-mcp-suite
```

Works as-is on Railway / Render / Fly.io: the image serves `POST /mcp` and answers `GET /health` for the platform healthcheck. MCPize does not take this image — see below.

### MCPize

Live at **<https://fastr-mcp-suite.mcpize.run>**; the marketplace listing is <https://mcpize.com/mcp/fastr-mcp-suite>.

[`mcpize.yaml`](../mcpize.yaml) uses `runtime: typescript`, so MCPize builds and runs the server itself and never sees `server/Dockerfile`. That runtime is single-package: its generated image copies `/app/dist` and `/app/node_modules` out of a builder that runs the build command from the repository root, and its runtime stage falls back to the root `package.json`. [`scripts/build-for-mcpize.mjs`](../scripts/build-for-mcpize.mjs) bridges the monorepo to that layout — it installs and builds `server/`, then copies `dist/` and `node_modules/` to the image root and replaces the root manifest with the server's, which is the one carrying `"type": "module"`.

Three things about the generated Dockerfile are worth knowing before editing the manifest:

- `build.install` runs with only the **root** package manifests copied in, so it cannot see `server/package-lock.json`. Dependencies are installed by `build.command`, which runs after the full source copy.
- `build.command` is executed through `cmd.exe` by the local pre-deploy check and `/bin/sh` in the image, so it is a plain `node` invocation — no shell operators.
- On Windows the tarball filter compares `/`-separated patterns against `\`-separated paths, so `server/node_modules` is uploaded. The build script discards it inside the image and reinstalls from the lockfile; the uploaded modules have no execute bit there.

```bash
npx -y mcpize doctor    # local pre-deploy validation
npx -y mcpize login     # opens the browser
npx -y mcpize deploy    # build + ship from this directory
npx -y mcpize status    # state, deployment history, the real backend error
npx -y mcpize logs --type build -d <deployment-id>   # build log; `logs` alone finds nothing
```

Publisher secrets are entered in the dashboard — `ALLOWED_HOSTS`, `LS_STORE_ID`, the three `LS_PRODUCT_*` ids, `VALID_LICENSE_KEYS`, `MCPIZE_GATEWAY_SECRET`, `AGENSI_GATEWAY_SECRET`. Every one is optional, so a deploy on an empty dashboard still serves the core tools.

Two MCPize-specific notes:

- **`ALLOWED_HOSTS` is left unset.** The gateway's own `/health` shadows the server's, and it is not documented which `Host` the proxy forwards, so an allowlist naming `*.mcpize.run` risks 403-ing every request. Unset means no host restriction (`server/src/http.ts` treats an empty value as "no allowlist"); the gateway enforces MCPize sign-in before anything reaches the service.
- **MCPize's gateway wants its own sign-in** and returns `401 Authentication required for hosted servers` on a bare `POST /mcp`. Use `npx mcpize run fastr-mcp-suite --list` to see the deployed catalog.

Subscribers can paste a Lemon Squeezy licence key as the `LICENSE_KEY` credential. MCPize forwards it as the `Authorization` header, which the HTTP transport already reads, so the per-card entitlement logic runs unchanged.

### Smithery

> **Retiring 31 October 2026.** Smithery's MCP proxy, managed identity, API, CLI and accounts shut down on that date; smithery.ai continues only as a public, non-proxied registry. The command below stops working then. List for free discovery if the listing already exists; do not build anything on this channel.

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
