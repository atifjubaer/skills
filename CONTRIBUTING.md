# Contributing to Atif Jubaer's Agent Skills

Thank you for your interest in contributing to this skills repository! We welcome contributions for new custom AI agent skills, updates to existing references, and fixes to the MCP server.

Here is a guide on how you (or your AI coding assistant) can add new skills and submit improvements.

---

## 1. How to Add a New Skill

To submit a new skill to the repository, follow these directory and file guidelines:

### Step A: Create your Skill Folder
Skills are located directly inside the `skills/` directory. Create a new folder matching your skill slug:
```bash
mkdir -p skills/<skill-name>
```
*Example:* `skills/fluentcart-developer` or `skills/wordpress-seo`

### Step B: Create the `SKILL.md` file
Inside your skill folder, create a `SKILL.md` file containing a YAML frontmatter header and the main instruction set:
```markdown
---
name: "WordPress SEO Specialist"
description: "Optimizes meta tags, schema structures, and handles sitemap configurations."
---

# WordPress SEO Specialist

Instructions for the AI assistant go here...
```

> [!IMPORTANT]
> The `name` and `description` string values in the YAML frontmatter **must be wrapped in double quotes** (`"`). Strict YAML parsers will fail if special characters (like colons `:`) are used without quotes.

### Step C: (Optional) Add Subdirectories
For Level 3 deep knowledge and presets, you can add:
*   `references/` - For detailed developer manuals (linked from your main `SKILL.md` using relative paths).
*   `assets/` - For boilerplate code, config templates, or resource assets.
*   `scripts/` - For executable automation scripts (Node.js/Python).

### Step D: Register in `skills.sh.json`
To make sure your skill displays under the correct section on the public `skills.sh` website, register your skill slug under a grouping in `skills.sh.json` at the root of the repository:
```json
{
  "title": "WordPress SEO",
  "description": "Skills for search engine optimization.",
  "skills": [
    "wordpress-seo"
  ]
}
```

---

## 2. Testing Your Changes Locally

There is no installer script and no CLI. Skills are plain Markdown plus a
`SKILL.md` frontmatter block, consumed directly from this repository — so the
checks are the repository's own, and they need no install: the root of this repo
has no dependencies.

```bash
npm run ci        # validate skills, the package, and server/skill parity
```

That runs three checks:

| Script | What it refuses |
| --- | --- |
| `npm run check:skills` | a `SKILL.md` with broken frontmatter, a missing section, or a dead internal link |
| `npm run check:package` | a published tarball that ships a file it should not, or drops one it needs |
| `npm run check:parity` | a skill copy that has drifted from the server's own bundled copy |

To check the MCP server itself, not just the Markdown:

```bash
npm run build:servers     # compile servers/fluentcart-developer
npm run verify:servers    # boot it over stdio and call every tool for real
```

`verify:servers` is the one that catches a tool that registers but throws — a
green build proves nothing on its own.

---

## 3. Submitting a Pull Request

1.  Fork the repository.
2.  Commit your changes using clear commit summaries (e.g. `feat: add wordpress-seo skill`).
3.  Push to your fork and submit a Pull Request to the `main` branch.
