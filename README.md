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
  - **5 Runnable Example Projects:** Custom Addon plugin, Fee Surcharge plugin, Payment Gateway plugin, Shipping Carrier, and Starter Child Theme.

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
└── skills/
    └── fluentcart-developer/  # 👈 Clean skill directory for skills.sh
        ├── SKILL.md           # Main index prompt file
        ├── references/        # Complete developer manuals & schemas
        └── examples/          # Standalone plugin & theme boilerplates
```

---

## Created by
Developed and maintained by **Fastrsoft** (Atif Jubaer).
