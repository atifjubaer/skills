# Atif Jubaer's AI Agent Skills

This repository is a central workspace for creating, managing, and distributing custom AI agent skills and project rules. It is designed to support multiple custom skills simultaneously across all IDEs and AI assistants (Antigravity/Gemini, Claude Code, Cursor, Windsurf, Cline, Zed, and GitHub Copilot).

---

## Setup & Installation

To install and activate these agent skills globally on your machine, run the installer:
```bash
npx skills add atifjubaer/skills
```
From the interactive prompt, select the skills you wish to install (e.g. **`FluentCart Developer`**) and select the target AI assistants/editors.

Alternatively, you can run our custom initializer directly:
```bash
npx atifjubaer-skills init
```
This will automatically sync and write the corresponding rule templates globally and locally inside your active workspace directories.

---

## Discovered Skills

*   **`fluentcart-developer`** - Comprehensive developer reference skill for building themes, plugins, and custom integrations (payment gateways, subscriptions) for FluentCart on WordPress.

---

## Installation Methods

### Method 1: Using the Custom Package CLI (Recommended)

Run our custom initializer directly from npm/npx:

```bash
# Install all skills globally and locally for all editors (Antigravity, Claude Code, Cursor, Zed, etc.)
npx atifjubaer-skills init

# List all skills currently hosted in this repository
npx atifjubaer-skills ls

# Install a specific skill only (e.g. fluentcart-developer)
npx atifjubaer-skills init --skill=fluentcart-developer
```

### Method 2: Using the Official `skills.sh` CLI

To install a specific skill globally via the official skills ecosystem:

```bash
# Using npm
npx skills add atifjubaer/skills --skill "FluentCart Developer"

# Using pnpm
pnpm dlx skills add atifjubaer/skills --skill "FluentCart Developer"

# Using yarn
yarn dlx skills add atifjubaer/skills --skill "FluentCart Developer"

# Using bun
bunx --bun skills add atifjubaer/skills --skill "FluentCart Developer"
```

---

## Guidelines for AI Assistants: Adding & Modifying Skills

If you are an AI assistant helping Atif Jubaer maintain this repository:

### Directory Structure Convention
Every skill must be nested inside a subdirectory under the `skills/` folder:
```
skills/skills/<category>/<skill-slug>/
├── SKILL.md            <-- [Required] YAML frontmatter + main prompts
├── rules.md            <-- [Optional] Custom agent style/coding guidelines
├── .cursorrules        <-- [Optional] Editor rules (Cursor, Windsurf, Cline)
├── CLAUDE.md           <-- [Optional] Claude Code system rules
├── references/         <-- [Optional] Level 3 documentation manuals
└── assets/             <-- [Optional] Code templates or presets
```

### How to Modify a Skill
1.  Navigate to `skills/skills/<category>/<skill-slug>/`.
2.  Edit the instructions in `SKILL.md` or update files inside `references/`.
3.  Instruct the user to run `node bin/index.js init` from the repository root to verify the files and sync them locally.
4.  Push the updates to GitHub via GitHub Desktop.

### How to Add a New Skill
1.  Create a folder representing the new skill under `skills/` (e.g., `skills/skills/productivity/fluentcart-checkout/`).
2.  Create a `SKILL.md` file starting with YAML frontmatter (ensure strings are wrapped in double quotes):
    ```markdown
    ---
    name: "FluentCart Checkout Specialist"
    description: "Optimizes WooCommerce alternative checkout panels."
    ---
    ```
3.  Register the new skill slug in `skills.sh.json` at the root of the repository.
4.  Run `node bin/index.js init` locally to test installation.
5.  Push to GitHub. Users can now install it using:
    ```bash
    npx skills add atifjubaer/skills --skill "FluentCart Checkout Specialist"
    ```
