# Atif Jubaer's Agent Skills Repository

[![npm version](https://img.shields.io/npm/v/fluentcart-developer.svg)](https://www.npmjs.com/package/fluentcart-developer)
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

- **`Lemon Squeezy Developer`** (`lemonsqueezy-developer`):
  - **Complete JSON:API Manual:** Stores, Products, Variants, Prices, Files, Orders, and Subscriptions specifications.
  - **HMAC-SHA256 Webhook Security:** Timing-safe raw request signature verifiers for Node.js, Next.js App Router, and PHP.
  - **Subscriptions Lifecycle:** State transitions, pausing, cancellations, dunning retries, and hosted customer portal URLs.
  - **Software Licensing:** Public `/activate`, `/validate`, and `/deactivate` endpoints for desktop software and plugins.
  - **Dynamic Checkouts & Lemon.js:** API checkout generation, in-app modal overlays, and custom metadata tracking.

- **`Fastr MCP Suite`** ([`fastr-mcp-suite`](skills/fastr-mcp-suite/SKILL.md)):
  - **Install Guide:** Exact config for Claude Code, Claude Desktop, Cursor, Windsurf, Cline, Zed, plus the hosted Streamable HTTP transport.
  - **Tool Reference:** All twelve `fc_*`, `ls_*`, and `suite_*` tools with their arguments, return shapes, and when to reach for each.
  - **No Gate:** Every tool is free for every client — no licence key, account, or request quota.
  - **Troubleshooting:** The failures people actually hit — unknown table names, unreachable reference files, and the Windows `npx` stdio artifact.

---

## Playing Cards (MCP Server)

Skills tell the model what to do. The MCP server in [`server/`](./server/README.md) gives it the tools to do it — without loading a single large markdown file into context.

| Card | Tools |
| --- | --- |
| **Card 1 — FluentCart Developer Agent** | `fc_search_hooks`, `fc_get_db_schema`, `fc_get_reference`, `fc_generate_payment_gateway_boilerplate`, `fc_generate_licensing_boilerplate`, `fc_generate_customer_endpoint_boilerplate` |
| **Card 2 — Lemon Squeezy Developer Agent** | `ls_search_docs`, `ls_get_schema`, `ls_get_reference`, `ls_verify_webhook`, `ls_validate_license` |
| **Suite** | `suite_get_info` |

Every session also exposes the skills catalog itself (`skills/list`, `resources/read`), so the agent reads one reference file on demand instead of the whole knowledge base. `fc_get_reference` and `ls_get_reference` open any file under a skill's `references/` folder by name, or a single heading inside it — that is how the 52 FluentCart and 7 Lemon Squeezy reference files reach an MCP client that never loads them wholesale.

```bash
npx -y fastr-mcp-suite    # stdio: no install, no build — published as fastr-mcp-suite

cd server && npm install && npm run build
node dist/index.js        # stdio: Claude Code, Cursor, Windsurf, Smithery CLI
node dist/http.js         # Streamable HTTP on :8080: MCPize, Railway, Render, Fly.io
```

All twelve tools are registered for every caller on both transports. There is no licence key, no account, no purchase, and no per-request quota — a client that can reach the server can call everything it ships. Deployment and transport details are documented in [`server/README.md`](./server/README.md).

**Licensing:** everything in this repository — the skills under `skills/` and the server under `server/` — is MIT. See [`server/LICENSE.md`](./server/LICENSE.md). Fork it, host it, sell support around it; the only ask is that you keep the copyright notice.

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
├── server/                    # 👈 MCP server (MIT, free)
│   ├── src/
│   │   ├── auth.ts            # Session descriptor (no gating)
│   │   ├── server.ts          # Server factory + skills catalog
│   │   ├── index.ts           # stdio entry
│   │   ├── http.ts            # Streamable HTTP entry
│   │   └── cards/             # One folder per Playing Card
│   ├── scripts/               # Build bundler + protocol probe
│   └── Dockerfile             # Build from repo root
└── skills/                    # 👈 Skill content (MIT, public)
    ├── fluentcart-developer/  # Card 1
    │   ├── SKILL.md
    │   ├── references/
    │   └── examples/
    └── lemonsqueezy-developer/ # Card 2
        ├── SKILL.md
        └── references/
```

---

## Created by
Developed and maintained by **Fastrsoft** (Atif Jubaer).
