# Atif Jubaer's Agent Skills Repository

[![fluentcart-developer](https://img.shields.io/npm/v/fluentcart-developer.svg?label=fluentcart-developer)](https://www.npmjs.com/package/fluentcart-developer)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive, platform-agnostic knowledge base, instruction set, and CLI toolkit for FluentCart theme, plugin, shipping, and payment gateway development.

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
| **[`fluentcart-developer`](./servers/fluentcart-developer)** | `fc_search_hooks`, `fc_get_db_schema`, `fc_get_reference`, `fc_generate`, `get_info` |

Every session also exposes the skills catalog itself (`skills/list`, `resources/read`). Three tools reach the documentation directly, which is how 588 pages stay out of the context window:

| Tool | What it answers |
| --- | --- |
| `fc_search_docs` | Full-text across all 588 pages. `query` words must all match; optional `prefix` scopes to `restapi/`, `database/`, `hooks/`, `modules/` |
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

`skills/fluentcart-developer/references/` is a **generated mirror of <https://dev.fluentcart.com>** — 588 Markdown pages laid out exactly as the site lays them out, plus an `INDEX.md`. It is regenerated, never hand-edited:

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

Choose the installation method that fits your environment and AI coding assistant:

### Method 1: The `skills.sh` Method (Recommended for Cursor, Claude Code, Windsurf, Antigravity)

Install this skill directly into your project's local workspace using the official `skills.sh` manager:

```bash
# Install specific skill into current project
npx skills add atifjubaer/skills --skill "fluentcart-developer"

# Or run interactively without flags to pick from list
npx skills add atifjubaer/skills
```

---

### Method 2: Updating Installed Skills

To fetch and update your installed skills to the latest version on GitHub:

```bash
# Update all installed skills in current workspace via skills.sh
npx skills update

# Or force reinstall the latest version from GitHub
npx skills add atifjubaer/skills --skill "fluentcart-developer" --force
```

If you cloned this repository locally:
```bash
git pull origin main
```

---

### Method 3: Direct CLI Initializer & Interactive Wizard

Run the CLI command without arguments for an interactive selection prompt:

```bash
npx fluentcart-developer
```

Or pass direct command flags:

```bash
# Initialize both global skills and current project rules for all IDEs
npx fluentcart-developer init

# Setup ONLY global skills (~/.gemini/, ~/.claude/)
npx fluentcart-developer global

# Setup ONLY local project rules
npx fluentcart-developer project

# Safely remove rule markers from project and global files
npx fluentcart-developer remove
```

---

### Method 4: Manual Installation

If you prefer manual setup:
1. **For Antigravity / Gemini**: Copy `SKILL.md`, `references/`, and `examples/` from `skills/fluentcart-developer/` into your global Gemini config path:
   `~/.gemini/config/skills/fluentcart-developer/`
2. **For Cursor / Windsurf / Cline / Zed**: Copy `.cursorrules` to your project root.
3. **For Claude Code**: Copy `CLAUDE.md` to your project root.
4. **For Web-based AIs**: Copy the content of `fluentcart-rules.md` and paste it into your chat session.

---

## Repository Folder Structure

```
skills/
├── README.md                  # Installation guide and repository overview
├── package.json               # Package configuration
├── copy-skills.js             # Automated skill sync builder
├── skills.sh.json             # skills.sh catalog layout configuration
├── CLAUDE.md                  # Claude Code instructions
├── CONTRIBUTING.md            # Guidelines for repository contributors
├── LICENSE                    # MIT License
├── bin/
│   └── index.js               # Interactive CLI runner
├── .github/
│   └── workflows/
│       └── sync-docs.yml      # GitHub Actions automated doc sync workflow
├── references/                # Root reference manuals catalog
├── examples/                  # Standalone boilerplate code examples
│   ├── sample-custom-payment-gateway/
│   ├── sample-shipping-carrier/
│   └── fluentcart-starter-child-theme/
├── servers/                   # 👈 MCP server (MIT, free)
│   └── fluentcart-developer/
│       ├── src/
│       │   ├── auth.ts        # Session descriptor (no gating)
│       │   ├── server.ts      # Server factory + skills catalog
│       │   ├── index.ts       # stdio entry
│       │   ├── http.ts        # Streamable HTTP entry
│       │   └── cards/         # This package's tools
│       ├── scripts/           # Skill bundler + stdio protocol probe
│       └── Dockerfile         # Build from repo root
└── skills/                    # 👈 Skill content (MIT, public)
    └── fluentcart-developer/
        ├── SKILL.md
        ├── references/
        └── examples/
```

---

## Created by
Developed and maintained by **Fastrsoft** (Atif Jubaer).
