# Contributing to Atif Jubaer's Agent Skills

Thank you for your interest in contributing to this skills repository! We welcome contributions for new custom AI agent skills, updates to existing references, and improvements to our installer.

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

Before submitting a Pull Request, verify your skill installer executes correctly:

1.  Navigate to your repository root.
2.  Run the local installer sync:
    ```bash
    node bin/index.js init
    ```
3.  Check that the skill files are compiled and successfully synced to your local editor profile directories (like Cursor, Claude, or Gemini).

---

## 3. Submitting a Pull Request

1.  Fork the repository.
2.  Commit your changes using clear commit summaries (e.g. `feat: add wordpress-seo skill`).
3.  Push to your fork and submit a Pull Request to the `main` branch.
