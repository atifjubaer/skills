# Working in this repository

FluentCart developer knowledge for AI coding assistants: a 593-page documentation
mirror, an MCP server that serves it on demand, and a DeepSeek Harness plugin
that wraps the server.

**[DISTRIBUTION.md](./DISTRIBUTION.md) is the map.** Read it before changing how
anything ships. It covers what each surface reads, how updates reach users, and
the traps that have already cost releases here.

---

## Layout

```
skills/fluentcart-developer/   the corpus and SKILL.md — one copy, no forks
servers/fluentcart-developer/  the MCP server (npm: fluentcart-developer)
plugins/dsh-plugin-fluentcart/ the DeepSeek Harness plugin (npm: dsh-plugin-fluentcart)
scripts/                       repo tooling — doc sync, validators, make-index
index.json                     the FastrSoft marketplace, generated
.claude-plugin/                Claude Code marketplace + plugin manifest
marketplace/                   listing artifacts for third-party directories
```

There are no bucket folders. Do not create `engineering/`, `productivity/`, or
`in-progress/` — this repository ships one skill.

---

## Commands

```bash
npm run ci              # skills + package + server/skill parity. No install needed.
npm run build:servers   # compile the MCP server
npm run verify:servers  # boot it over stdio and call every tool for real
npm run sync:docs       # re-capture dev.fluentcart.com (--dry-run for inventory only)
npm run sync:docs:apply # copy that capture into references/ (--dry-run to preview)
npm run make-index      # regenerate index.json after a publish, then commit it
```

`npm run ci` at the root needs no `npm ci`: the root package has no dependencies.

---

## Rules

1. **Never hand-edit `skills/fluentcart-developer/references/`.** It is a
   generated mirror. Run `npm run sync:docs`. A hand edit is erased by the next
   sync and makes the corpus disagree with the vendor.
2. **Never hand-edit `index.json`.** Every listed version needs a real
   `publishTimestamp` and only the registry has those. Run `npm run make-index`.
3. **One corpus.** `plugins/dsh-plugin-fluentcart/skills/` is a bundled copy;
   `npm run check:parity` fails when it drifts from the source. Do not let the
   two diverge, and do not add a second copy of any page.
4. **A version bump is a release.** Claude Code and DeepSeek Harness users see
   nothing until a version number changes. Merging to `main` reaches only npm
   and `git pull` users.
5. **No stored credentials.** Both packages publish over OIDC trusted
   publishing. Never add an npm token — and never rename a release workflow,
   because npm's trusted publisher names the exact filename.

---

## Publishing

Publishing is done from GitHub Actions, not a laptop:

- **Server** — Actions → **Release** → Run workflow. `dry_run: true` first.
- **Plugin** — Actions → **Release plugin** → Run workflow.
- **Index** — `npm run make-index`, commit `index.json`. Committing it *is*
  publishing it.

Details, including the caret-range and release-age traps, are in
[DISTRIBUTION.md](./DISTRIBUTION.md).
