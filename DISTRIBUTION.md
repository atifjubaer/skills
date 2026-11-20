# How this repository is distributed

One corpus, four ways to install it, and one question every user eventually
asks: *how do I get the next version?*

This is the maintainer's map. It covers what each surface actually reads, what a
user must run, what an update costs, and what breaks if you skip a step.

> If you only want to *use* the thing, read the [install section](README.md#installation--setup) instead.

---

## 1. The mental model

There is exactly one copy of the knowledge: `skills/fluentcart-developer/references/`,
593 Markdown pages mirrored from <https://dev.fluentcart.com>. Everything else is
a way of delivering it.

```
skills/fluentcart-developer/             ← the knowledge. One copy. No forks.
│   ├── SKILL.md                           rules + routing
│   ├── references/                        593 pages (5.0 MB)
│   └── examples/
│
├── shipped inside ──► fluentcart-developer        (npm — the server)
│                          │  prepack copies the corpus into dist/skills/
│                          │  prepublishOnly builds + probes
│                          └── wrapped by ──► dsh-plugin-fluentcart   (npm — the plugin)
│                                                    bundled skills/ copy
│
├── listed in ──────► index.json                    (FastrSoft marketplace, DSH)
├── described by ───► .claude-plugin/               (Claude Code marketplace)
└── linked by ──────► .mcp.json, skills.sh.json     (raw MCP, skill-only installs)
```

Two things follow from that picture, and they explain almost every design
decision in this repo:

1. **A delivery surface never holds the knowledge itself.** It holds a pointer:
   an npm dependency, a relative path, a URL. That is why the corpus can change
   without touching four manifests.
2. **Every surface has its own cache and its own update trigger.** npm resolves
   per-run, DeepSeek Harness installs per-version, Claude Code copies per-version,
   `skills.sh` copies per-run. There is no single "deploy" button, so §5 spells
   out each one.

---

## 2. The npm server, and why it is packaged the way it is

`servers/fluentcart-developer` is published as **`fluentcart-developer`**. Its
tarball contains roughly three things: the compiled `dist/` (including a copy of
the corpus), `README.md`, and `LICENSE.md`. `npm run check:package` asserts
exactly that, so a stray file fails CI instead of shipping.

### The three lifecycle hooks

| Script | Runs | What it guarantees |
| --- | --- | --- |
| `build` | `tsc` then `scripts/copy-skills.mjs` | Compiles, copies `references/` into `dist/skills/`, and **refuses to ship fewer than 500 pages** |
| `prepublishOnly` | `npm run build && npm run verify` | Nothing reaches the registry without a compile and a live probe |
| `version` | `scripts/sync-version.mjs` | Rewrites `SERVER_VERSION` in `src/version.ts` so the constant never drifts from `package.json` — npm runs it for you on `npm version` |

The 500-page floor is not decoration. A half-finished sync once produced a
tarball that installed fine and answered nothing; a user cannot tell a truncated
corpus from a wrong answer, so the failure has to happen at publish time.

`verify` is the other half of that. A green build proves the TypeScript compiled,
not that a tool works — it boots the server and makes a real call, including a
negative control (`trial_guard` must be *refused*).

### Why the server is its own package

The corpus is 5.0 MB and the tooling is ~3,800 lines. A model should not have to
carry either to answer one question. The package gives it six tools that read
the documentation on demand, so a session costs a few hundred tokens until it
actually looks something up.

### Publishing is not done from a laptop

`.github/workflows/release.yml` publishes over **OIDC trusted publishing** with
`--provenance`. There is no npm token in this repository and there should never
be one. Two consequences:

- **The workflow filename is load-bearing.** npm's trusted publisher for the
  package names `.github/workflows/release.yml` exactly. Rename the file and
  every publish is refused until the trust config on npmjs.com is updated to
  match.
- **A local `npm publish` will fail.** If you ever need a break-glass publish,
  that is a deliberate decision to create a token, and it should be revoked
  afterwards.

The release flow is: merge to `main`, then **Actions → Release → Run workflow**,
`dry_run: true` first to prove the tarball, then `dry_run: false`.

---

## 3. DeepSeek Harness: the plugin, and the index behind it

### The plugin

`plugins/dsh-plugin-fluentcart` is a second npm package. It exists because a DSH
user otherwise has to edit `cordis.yml` by hand to mount an MCP server. The
plugin reduces that to one compose row, and registers the skill at the same time.

It is a **bundle**, not a profile — `dsh.bundle.patch` in its `package.json`
declares a `cordis.patch.yml` with one row:

```yaml
- insert: [{ id: fluentcart, name: dsh-plugin-fluentcart }]
```

At load time `lib/index.js` resolves the server from *its own* dependencies and
spawns it with `process.execPath`. That is deliberate: the server runs on the
same Node that runs the harness, so there is no `PATH` lookup and no version skew
between two Node installs.

Its `@deepseek-ai/dsh-mcp-client` dependency is a **peer**, so the host's copy is
used and a second MCP client never loads beside the harness's own.

### The index

`index.json` at the repository root is a `format: 1` plugin index — the
**FastrSoft** marketplace. It is generated, never hand-edited:

```bash
npm run make-index    # then commit index.json
```

Every listed version needs a real `publishTimestamp` and only the registry has
those, so a hand-kept file drifts the first time someone publishes without
touching it. Committing the file *is* publishing it, because it is served from
the repository.

Adding a plugin needs no change to the generator. Create `plugins/<name>/` whose
`package.json` declares both keys:

| Key | What it is |
| --- | --- |
| `dsh.bundle` | the compose layer — makes the package installable |
| `dsh.marketplace` | the card — title, description, icon, category, labels |

The next `make-index` picks it up. Icons are inlined as `data:` URLs (capped at
32 KiB) so the index stays one self-contained file on any static host.

### Three traps that have actually cost time here

1. **The raw URL must serve 2xx without a redirect.** `github.com/.../blob/...`
   redirects and Discover rejects it. Use `raw.githubusercontent.com`.
2. **A fresh publish is not instantly installable.** pnpm's `minimumReleaseAge`
   cooldown skips versions younger than the threshold, so a brand-new release
   can resolve to an *older* one. Pin the exact version (`@3.0.1`) when
   verifying.
3. **A caret range stops at every major.** `^3.0.1` can never resolve `4.0.0`.
   The plugin's dependency on the server has fallen behind this way three times.
   When the server goes to a new major, bump the plugin's dependency in the same
   release:

   ```bash
   cd plugins/dsh-plugin-fluentcart
   npm install fluentcart-developer@^<new-major> && npm test
   ```

   `npm test` mounts the plugin in a real Cordis context and connects a real
   spawned server, so it fails if the dependency resolved to the wrong version.

```bash
dsh plugin --profile web add dsh-plugin-fluentcart
```

---

## 4. Claude Code: a marketplace, not a package

`.claude-plugin/marketplace.json` lists one plugin whose `source` is
`"./plugins/claude-plugin-fluentcart"`. Users run:

```
/plugin marketplace add atifjubaer/skills
/plugin install fluentcart-developer@fluentcart-skills
```

**This needs no npm, no npx, and no account.** Claude Code clones the repository
with `git` and copies *only that directory* into `~/.claude/plugins/cache/` —
2,726 bytes, three files. npm enters the picture only *later*, when the plugin's
`.mcp.json` starts the server:

```json
{ "mcpServers": { "fluentcart": { "command": "npx", "args": ["-y", "fluentcart-developer"] } } }
```

So the honest split is: **installing the plugin needs no npm; using its tools
does**, because `npx` is how the server is fetched and launched. That is
identical to every other MCP client, and it is what keeps the corpus out of the
repository clone the user already has.

There is a plugin entry for the marketplace (`marketplace.json`) and a manifest
for the plugin itself (`plugin.json`). They must agree on `name`, or install
fails with `Plugin "<name>" not found in marketplace "<marketplace>"`.

### Why the plugin is a subdirectory, not the repository root

It used to be the root. That worked, and it was expensive: installing a plugin
copies its directory into the cache, so every user copied the entire 4 MB
documentation corpus — which the tools never read, because they fetch it from
npm. Three copies of the same pages ended up on disk: the marketplace clone
(7.5 MB), the plugin copy (4 MB), and the npm package (3.5 MB).

The plugin is now three files — `plugin.json`, `.mcp.json`, `README.md` — and
`npm run check:plugin` fails if it grows past 64 KB, ships a `references/` page,
stops launching through `npx`, or falls behind the server's version.

It ships **no `skills/` directory** on purpose. The server sends its rules in the
`initialize` handshake, which Claude Code injects into the system prompt, so a
`SKILL.md` here would be a second copy of the same guidance able to drift from
the first — and its relative links would point at files a lean install does not
have. The full skill remains available through the DeepSeek Harness plugin and
`skills.sh`.

### The icon does not show, and cannot

The Directory dialog in `/plugin` renders a generic glyph for every plugin.
That is not a third-party-tools problem and not a bug in this repository:

> `icon` — Icon for the plugin's listing in **Anthropic's directory**. **Claude Code doesn't read it.**

Claude Code has no icon rendering in `/plugin` at all. The field is read only
when a plugin is submitted to Anthropic's published directory — and that
submission needs a **square PNG, 512–2048 px, under 2 MB**:

```
⚠ icon: No icon (ICON_MISSING)
   SVG and WebP are not accepted.
```

So the SVG that backs the DeepSeek Harness card could not be reused here even
if it were read. No `icon` is set: it would be a file nothing loads. Add one at
`.claude-plugin/icon.png` when there is a listing to submit to.

### Which version a user is on

This is the part that silently breaks "continuous update". Claude Code computes
a version per plugin, and **that is how it detects an update**. Resolution order:

1. `version` in `plugin.json` ← wins
2. `version` in the marketplace entry
3. otherwise the commit SHA of the installed directory (12 chars, for a
   relative path inside a git-hosted marketplace)

So a pinned `version` that never changes **holds every user on their cached copy
forever**, however many commits you push. Two valid strategies, and this repo
picks the first:

- **Bump `version` on every release.** Deterministic, and the number means
  something. `.github/workflows/release.yml` bumps `.claude-plugin/plugin.json`
  in the same run that publishes the npm package, so both audiences move
  together.
- **Omit `version` entirely.** Users then track commits. Simpler, but the
  version string stops identifying anything.

Never set `version` in both files — the manifest wins without warning and
`claude plugin validate` reports the mismatch.

---

## 5. Continuous update: how a user actually receives a change

| Surface | What a user runs | When they get your change |
| --- | --- | --- |
| **MCP server, any client** | nothing — `npx -y fluentcart-developer` | Next launch. `-y` resolves the range against the registry each run, so a publish is live as soon as the registry serves it. |
| **Claude Code** | `/plugin marketplace update fluentcart-skills` then `/plugin update`, or turn on auto-update for the marketplace | After the bump to `plugin.json` reaches the marketplace clone. Auto-update is **off by default** for any marketplace that is not Anthropic's own. |
| **DeepSeek Harness** | `dsh plugin --profile web add dsh-plugin-fluentcart` again, or the card's **Update available** | When a new npm version exists **and** `index.json` lists it. The card is only as fresh as the index, so run `make-index` after publishing. |
| **skills.sh (skill only)** | `npx skills update` | Next run. It re-reads the repository. |
| **Git clone** | `git pull` | Immediately. |

Two of those are manual steps a maintainer can forget, so they are automated or
guarded:

- **`index.json` staleness** — `make-index` re-reads the registry. A release
  that skips it leaves Discover showing the previous version. The release
  workflow prints the reminder in its run summary.
- **Corpus drift** — `skills/fluentcart-developer/references/` is a snapshot of
  the vendor's site. `.github/workflows/sync-docs.yml` runs the sync weekly and
  opens a pull request when any page changed, so drift is a reviewable diff
  rather than a surprise.

---

## 6. Adding a thing

### A new MCP server or skill in this repo

1. `skills/<name>/SKILL.md` with quoted `name` and `description` frontmatter.
2. `npm run check:skills` — frontmatter, sections, internal links.
3. Register it in `skills.sh.json` so it appears on the public catalogue.
4. If it ships a server, put it under `servers/<name>/` and add the build and
   verify jobs to `ci.yml`.

### A new DeepSeek Harness plugin

1. `plugins/<name>/` with `lib/index.js`, `cordis.patch.yml`, `package.json`.
2. `package.json` declares `dsh.bundle.patch` **and** `dsh.marketplace`.
3. `npm test` must mount it in a real Cordis context and dispose it cleanly — a
   leaked child process fails by hanging, so the timeout is a real assertion.
4. `npm run make-index` from the root. The card appears with no edit to any
   generator, and no other plugin's entry changes.

### A new harness

Ask the same four questions of each surface, and write the answers down here:

| Question | Why it decides the shape |
| --- | --- |
| Does it speak MCP? | If yes, point it at `npx -y fluentcart-developer` and you are done. |
| Does it have a plugin/extension format? | Then wrap the server so the user does not hand-edit config. The wrapper is thin on purpose — see `plugins/dsh-plugin-fluentcart/lib/index.js`. |
| How does it cache and version what it installs? | This decides whether users get updates automatically or need a command. A pinned version with no bump is a silent freeze. |
| Does it read an index/catalogue? | If yes, generate it. A hand-kept catalogue drifts the first time someone publishes without updating it. |

Then add one row to the table in §5. A surface that is not in that table is a
surface whose update story nobody has thought about.

---

## 7. The invariants

Four rules that keep the picture above true. Each one exists because breaking it
has already cost a release here.

1. **One corpus.** No premium fork, no per-harness copy of the pages. The
   plugin's `skills/` copy is a bundled artifact and must match the source —
   `npm run check:parity` is what enforces that.
2. **A version bump is a release, not a commit.** Users on Claude Code and DSH
   see nothing until a number changes. Merging to `main` updates only the npm
   and `git pull` audiences.
3. **Every listed version must be timestamped by the registry.** That is why the
   index is generated. Never hand-write `publishTimestamp`.
4. **No stored credentials.** OIDC publishes both packages. A token in this
   repository would be the single highest-value secret in it and it is not
   needed.
