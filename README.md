# Atif Jubaer's AI Agent Skills

This repository is a central workspace for creating, managing, and distributing custom AI agent skills and project rules.

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
npx skills add atifjubaer/skills --skill fluentcart-developer

# Using pnpm
pnpm dlx skills add atifjubaer/skills --skill fluentcart-developer

# Using yarn
yarn dlx skills add atifjubaer/skills --skill fluentcart-developer

# Using bun
bunx --bun skills add atifjubaer/skills --skill fluentcart-developer
```

---

## How to Add New Skills

To add a new skill to this repository:

1.  Create a folder representing your skill under the `skills/` directory (e.g., `skills/my-new-skill/`).
2.  Add a `SKILL.md` file inside it containing the required YAML frontmatter:
    ```markdown
    ---
    name: "My Custom Skill"
    description: "Detailed description of what this skill teaches the AI agent."
    ---

    # My Custom Skill Content
    ```
3.  Register the new skill slug under groupings in `skills.sh.json` at the root of the repository.
4.  Commit and push your changes to GitHub!
