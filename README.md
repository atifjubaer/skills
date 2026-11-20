# Atif Jubaer's Agent Skills Repository

[![fluentcart-developer](https://img.shields.io/npm/v/fluentcart-developer.svg?label=fluentcart-developer)](https://www.npmjs.com/package/fluentcart-developer)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive, platform-agnostic knowledge base and instruction set for FluentCart theme, plugin, shipping, and payment gateway development — shipped with a local MCP server that serves the documentation on demand instead of pasting it into the prompt.

This repository provides ready-to-use configurations, reference manuals, and code boilerplates for all major AI coding assistants (Antigravity, Cursor, Claude Code, Windsurf, Cline, Zed, GitHub Copilot), enabling them to write correct, compatible code for FluentCart out-of-the-box.

---

## Included Skills

- **`FluentCart Developer`** (`fluentcart-developer`):
  - **Complete Database Manual:** 34 DB migrations, all `wp_fct_*` schema tables, Eloquent ORM models, relationships, and Query Builder.
  - **315+ Action & Filter Hooks:** 14 dedicated hook reference files covering order lifecycles, payment webhooks, cart fees, and admin UI.
  - **15 REST API Modules (Core & Pro):** Orders, Products, Customers, Coupons, Subscriptions, Tax, Shipping, Settings, Email Notifications, Reports, Integrations, Files, Labels & Attributes, Dashboard & Utilities, Public Shop, Checkout, Customer Profile, Software Licensing (Pro), Roles & Permissions (Pro), Order Bumps (Pro).
  - **6 Runnable Example Projects:** Custom Addon plugin, Fee Surcharge plugin, Payment Gateway plugin, Shipping Carrier, Starter Child Theme, and Software Licensing SDK plugin.

- **MCP server** — the skill ships with its own, so installing it never drags in a second product:
  - **[`fluentcart-developer`](./servers/fluentcart-developer)** — 6 tools for FluentCart.
  - It is free for every client: no licence key, account, or request quota.

---

## MCP Servers

Skills tell the model what to do. The server gives it the tools to do it — without loading a single large markdown file into context. It ships as its own package: the FluentCart knowledge tree is 1.6 MB and 3,800 lines of tooling, and a model should not have to carry all of it to answer one question.

| Server | Tools |
| --- | --- |
| **[`fluentcart-developer`](./servers/fluentcart-developer)** | `fc_search_docs`, `fc_search_hooks`, `fc_get_db_schema`, `fc_get_reference`, `fc_generate`, `get_info` |

Every session also exposes the skills catalog itself (`skills/list`, `resources/read`). Three tools reach the documentation directly, which is how 593 pages stay out of the context window:

| Tool | What it answers |
| --- | --- |
| `fc_search_docs` | Full-text across all 593 pages. `query` words must all match; optional `prefix` scopes to `restapi/`, `database/`, `hooks/`, `modules/` |
| `fc_get_reference` | One page by path (`restapi/operations/orders/void-renewal.md`), or a single heading inside it |
| `fc_get_db_schema` | One `wp_fct_*` table, read from `database/schema.md` |

### Running it locally, with no marketplace

The server is stdio-first, so any harness that can launch a process can use it — Claude Code, Claude Desktop, Cursor, Windsurf, OpenCode, DeepSeek. No account, no key, no quota:

```bash
npx -y fluentcart-developer       # stdio: no install, no build
```

From a checkout:

```bash
cd servers/fluentcart-developer && npm install && npm run build
node dist/index.js                # stdio
node dist/http.js                 # Streamable HTTP on :8080
```

Register it with Claude Code in one line:

```bash
claude mcp add fluentcart -- npx -y fluentcart-developer
```

Every tool is registered for every caller on both transports. There is no licence key, no account, no purchase, and no per-request quota. `npm run verify` boots the built server over stdio and asserts a real call against every tool.

---

## Keeping the documentation current

`skills/fluentcart-developer/references/` is a **generated mirror of <https://dev.fluentcart.com>** — 593 Markdown pages laid out exactly as the site lays them out, plus an `INDEX.md`. It is regenerated, never hand-edited:

```bash
npm run sync:docs        # re-capture every page
```

**[UPDATING.md](./UPDATING.md)** — maintainer notes for refreshing the corpus
and publishing a release. Not required to use the skill.

`scripts/sync-fluentcart-docs.mjs` does this without a browser and without a single click:

1. **Inventory** — reads `/hashmap.json` (585 source pages, authoritative) and the `__VP_SITE_DATA__` sidebar config embedded in any page (566 canonical links). Both are VitePress build artifacts, so no page is guessed at and no unlinked page is missed.
2. **URL resolution** — sidebar links win, because `payment_setting_fields.md` is one filename and cannot be recovered by turning `_` into `/`. A small override table covers the last few: `database_readme.md` is served at `/database/README`, and `/engineering/` is a hand-built landing page.
3. **Capture** — fetches each page and slices out `div.vp-doc`, the fully server-rendered body.
4. **Convert** — HTML to Markdown: headings, fenced code with its language tag, GFM tables, lists, links, VitePress admonitions. Internal `.html` links are rewritten to `.md` so they resolve offline.
5. **OpenAPI fallback** — the 449 `restapi/operations/*` pages are shells, because VitePress renders them client-side and the HTML ships an empty body. When a capture comes back under 200 bytes the script fetches `/openapi/public/<path>.json` and renders the real endpoint: method, route, parameters table, request body and every response code.
6. **Manifest** — `.vendor-docs/fluentcart-dev/_manifest.json` records url, status, bytes and a sha256 for every page, so two syncs can be diffed.

Output lands in `.vendor-docs/` (git-ignored) and is copied into `skills/fluentcart-developer/references/`. The five FastrSoft-authored files are preserved through every sync — they do not come from the vendor site, so a sync must not overwrite them.

The Agensi listing is a **curated subset** (`AGENSI_SECTIONS` in `scripts/package-agensi-skills.mjs`), because that marketplace rejects archives over 50 files: hooks, modules, payment integration, guides and a generated index — 50 files exactly.

**Licensing:** everything in this repository is MIT. Fork it, host it, sell support around it; the only ask is that you keep the copyright notice.

---

## Installation & Setup

There are two things to install, and they do different jobs:

- **The MCP server** gives the model 6 tools that read the documentation on demand.
- **The skill** is a Markdown file of rules the model reads if it chooses to.

Install the server. The skill is optional once you have it, because the server
sends the same rules in its `initialize` handshake, which every client injects
into the system prompt before the first turn.

### Method 1: Any MCP client (recommended)

Works with Claude Code, Cursor, Windsurf, Cline, Zed, OpenCode — anything that
speaks MCP. Add this to your client's MCP config:

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

Claude Code reads `.mcp.json` at the project root; most clients take the same
shape with a different filename.

---

### Method 2: DeepSeek Harness

As a plugin, which registers the server *and* the skill in one row:

**Desktop app** — **Plugins → Add plugin**, enter `dsh-plugin-fluentcart`, keep
**Official npm registry**, and choose **Install**.

**CLI**:

```bash
dsh plugin --profile web add dsh-plugin-fluentcart
```

---

### Method 3: Claude Code plugin marketplace

```
/plugin marketplace add atifjubaer/skills
```

---

### Method 4: `skills.sh` — the skill files only

This installs the Markdown, not the tools. Use it if you want the rules
somewhere the MCP server cannot reach.

```bash
npx skills add atifjubaer/skills --skill "fluentcart-developer"
```

You can also clone the repository and copy `skills/fluentcart-developer/` into
your assistant's skill directory yourself — that directory is self-contained
(`SKILL.md`, `references/`, `examples/`, `scripts/`).

---

### Updating

```bash
# MCP server — npx -y pulls the latest on every run
# DeepSeek Harness plugin
dsh plugin --profile web add dsh-plugin-fluentcart

# Skill files
npx skills update
```

If you cloned the repository: `git pull origin main`.

---

## The FastrSoft plugin index

DeepSeek Harness can browse a catalogue and install from it. This repository
serves one:

```
https://raw.githubusercontent.com/atifjubaer/skills/main/index.json
```

Turn on **Custom plugin indexes** under **Experimental plugins** in the Plugins
page — the **Discover** tab only appears once that is on — then
**Add index source** with the URL above.

[`index.json`](./index.json) is generated, never hand-edited: every listed
version needs a real `publishTimestamp` and only the registry has those.

```sh
npm run make-index    # after a publish, then commit index.json
```

It is generated from `plugins/`, so a new plugin appears with no edit to any
generator. Each one declares two things in its own `package.json`:

| Key | What it is |
|---|---|
| `dsh.bundle` | the compose layer — makes the package installable |
| `dsh.marketplace` | the card — title, description, icon, category, labels |

The index title (**FastrSoft**) is the marketplace; each card is one product.

---

## Repository Folder Structure

```
skills/
├── README.md                     # this file
├── package.json                  # repo scripts: checks, doc sync, packaging
├── skills.sh.json                # skills.sh catalog layout
├── mcpize.yaml                   # MCPize deployment manifest
├── CLAUDE.md · UPDATING.md · CONTRIBUTING.md · LICENSE
│
├── .claude-plugin/               # Claude Code plugin + marketplace manifests
├── .mcp.json                     # MCP config for this repo
├── .github/workflows/
│   ├── ci.yml                    # build, protocol probe, docker, sample compile
│   ├── release.yml               # publishes fluentcart-developer (OIDC + provenance)
│   └── release-plugin.yml        # publishes dsh-plugin-fluentcart
│
├── index.json                    # 👈 the FastrSoft marketplace, served to Discover
├── scripts/                      # repo tooling: doc sync, validators, packaging,
│                                 #   make-index (regenerates index.json)
├── marketplace/                  # listing artifacts for third-party directories
│
├── servers/                      # 👈 the MCP server (npm: fluentcart-developer)
│   └── fluentcart-developer/
│       ├── src/
│       │   ├── server.ts         # server factory + instructions + skills catalog
│       │   ├── index.ts          # stdio entry
│       │   ├── http.ts           # streamable HTTP entry
│       │   ├── auth.ts           # session descriptor (no gating)
│       │   └── cards/fluentcart/tools.ts   # the 6 tools
│       ├── scripts/              # skill bundler + stdio protocol probe
│       └── Dockerfile
│
├── plugins/                      # 👈 one directory per DeepSeek Harness plugin
│   └── dsh-plugin-fluentcart/
│       ├── cordis.patch.yml      # one compose row
│       ├── lib/index.js          # mounts the MCP server + registers the skill
│       ├── skills/fluentcart-developer/SKILL.md
│       └── test/e2e.mjs
│
└── skills/                       # 👈 the skill content
    └── fluentcart-developer/
        ├── SKILL.md
        ├── references/           # 593 documentation pages
        ├── examples/
        └── scripts/
```

---

## Created by
Developed and maintained by **Fastrsoft** (Atif Jubaer).
