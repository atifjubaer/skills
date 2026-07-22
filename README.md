# Atif Jubaer's Agent Skills Repository

A comprehensive, platform-agnostic knowledge base, instruction set, and CLI toolkit for FluentCart (v1.5.1+) theme, plugin, shipping, and payment gateway development.

This repository provides ready-to-use configurations, reference manuals, and code boilerplates for all major AI coding assistants, enabling them to write correct, compatible code for FluentCart out-of-the-box.

---

## Included Skills

- **`FluentCart Developer`** (`fluentcart-developer`): Complete WordPress e-commerce developer skill, database Eloquent models, REST API reference, payment gateway integration, dynamic fee systems, shipping carriers, and shortcodes.

---

## Installation & Setup

Choose the installation method that fits your environment and AI coding assistant:

### Method 1: The `skills.sh` Method (Recommended for Cursor, Claude Code, Windsurf, Open Code)

Install this skill directly into your project's local workspace using the official `skills.sh` manager:

```bash
# Using npm
npx skills add atifjubaer/skills --skill "FluentCart Developer"

# Or run interactively without flags to pick from list:
npx skills add atifjubaer/skills
```

---

### Method 2: Direct CLI Initializer & Interactive Wizard

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

### Method 3: Manual Installation

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
