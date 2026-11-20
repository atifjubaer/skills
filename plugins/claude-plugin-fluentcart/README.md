# fluentcart-developer — Claude Code plugin

One-click install of the FluentCart MCP server. The plugin itself is three small
files; the server and its documentation come from npm at launch.

```
.claude-plugin/plugin.json   identity + version
.mcp.json                    declares the fluentcart server, launched with npx
README.md                    this file
```

Nothing here is copied into the plugin cache except those three files — a few
hundred bytes. That is the whole point of the layout: an earlier version used
the repository root as the plugin root, which made every install copy 4 MB of
documentation that the server never reads.

## Install

```
/plugin marketplace add atifjubaer/skills
/plugin install fluentcart-developer@fluentcart-skills
```

Then turn on auto-update for the marketplace under **Marketplaces** in
`/plugin`, or update by hand with `/plugin marketplace update fluentcart-skills`.

**No npm package is installed by the plugin.** `npx -y fluentcart-developer`
fetches and caches the server the first time the server starts, and re-resolves
it on later launches, so the tools stay current without a second update step.

## Why there is no `skills/` here

The server sends its rules in the MCP `initialize` handshake, which Claude Code
injects into the system prompt before the first turn. Shipping a `SKILL.md`
beside it would be a second copy of the same guidance, able to drift from the
first, and its relative links (`references/…`) would point at files a lean
install does not have.

The full skill is still available where file access matters — through the
DeepSeek Harness plugin, or `npx skills add atifjubaer/skills`.

## Why there is no `icon`

Claude Code does not read a plugin's `icon` field — the `/plugin` directory
dialog draws a generic tile for every plugin, Anthropic's own included. The
field is only read when a plugin is submitted to Anthropic's published
directory, so it is not worth carrying a file that no build reads.

`claude plugin validate` says the same thing, and adds the reason not to guess:

```
⚠ icon: No icon (ICON_MISSING)
   Add a square PNG at .claude-plugin/icon.png, 512–2048 px, under 2 MB.
   SVG and WebP are not accepted.
```

So a submission would need a **PNG**, not the SVG the DeepSeek Harness card
uses. Add one at that path when there is a listing to submit to; changing it
afterwards no longer changes the icon.

## Licence

MIT. Copyright (c) 2026 Atif Jubaer (Fastrsoft).
