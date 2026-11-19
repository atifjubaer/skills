# Keeping the FluentCart docs current

> **Maintainer notes — not part of the skill.** This is my own release routine
> for refreshing the corpus and shipping a new version. None of it reaches
> users: the npm package ships `references/` and the server, never this file.
> Someone installing the plugin never needs to read it.

`skills/fluentcart-developer/references/` is **generated**. Every file in it is
captured from <https://dev.fluentcart.com>. Hand-editing one is pointless — the
next sync overwrites it.

Refresh the whole corpus in one command:

```bash
npm run sync:docs
```

That is the entire update procedure. Roughly 3 minutes, ~3.1 MB downloaded.

---

## What happens when you run it

`scripts/sync-fluentcart-docs.mjs` does six things. Understanding them is what
lets you debug a bad sync.

### 1. Inventory — never crawl

The site is **VitePress**. It publishes its own index, so the script reads it
instead of following links:

| Source | URL | Gives |
| --- | --- | --- |
| Hash map | `/hashmap.json` | 585 source pages — the authoritative count |
| Sidebar | `__VP_SITE_DATA__` inside any page | 566 canonical URLs |

If `pages to fetch` drops sharply, the site changed its build. That number is
your canary — compare it to the 590 the last successful run reported.

### 2. URL resolution — sidebar wins

`hashmap.json` keys are file paths with `/` turned into `_`. Reversing that is
wrong for filenames that contain a real underscore:
`payment-methods-integration_payment_setting_fields.md` is one file, not three
directories. So canonical sidebar links take priority and hashmap derivation is
only the fallback.

Two overrides are hard-coded because no rule can derive them:

```js
'/database/readme'  -> '/database/README'                                    // case
'/payment-methods-integration/payment/setting/fields'
                    -> '/payment-methods-integration/payment_setting_fields'  // underscore
```

### 3. Capture — slice `div.vp-doc`

Each page's body is already server-rendered into `<div class="vp-doc …">`. The
script balances nested `<div>` tags to find the closing one; a regex truncates
or overruns.

### 4. Convert — HTML to Markdown

Headings, fenced code with its language tag, GFM tables, lists, links,
VitePress admonitions. Internal `.html` links are rewritten to `.md` so the
mirror works offline.

### 5. OpenAPI fallback — the important one

**449 of the 590 pages are `restapi/operations/*`, and all of them render an
empty body.** VitePress builds them client-side from OpenAPI fragments, so the
HTML ships nothing but a heading.

When a capture comes back under 200 characters, the script fetches
`/openapi/public/<path>.json` instead and renders the real endpoint: method,
route, parameters table, request body, response codes — titled from the spec's
`summary`. Without this the corpus looks complete and is 76% empty.

### 6. Manifest

`.vendor-docs/fluentcart-dev/_manifest.json` records url, status, bytes and a
sha256 per page. Diff two manifests to see exactly what the vendor changed.

---

## After every sync — check these four numbers

```bash
npm run sync:docs
```

| Expect | Why |
| --- | --- |
| `pages to fetch: ~590` | a drop means the sidebar moved |
| `589/589 pages captured` | a `FAIL` line names the URL and status |
| `skip … /engineering/authoring` | known 404 on the vendor side; harmless |
| `~3100 KB Markdown` | half that means the OpenAPI fallback stopped firing |

Then confirm a known page still has real content:

```bash
head -3 skills/fluentcart-developer/references/restapi/operations/orders/void-renewal.md
# must start: # POST Void Renewal Invoice
```

If it starts with `# /restapi/operations/...` instead, the spec fallback broke
and every operation page is a shell again.

Finally, rebuild and probe the server:

```bash
cd servers/fluentcart-developer
npm ci && npm run build && npm run verify
```

`verify` boots the server over stdio and calls every tool for real. It must
report **37/37**.

---

## Publishing a refresh

The npm package bundles its own copy of the docs — a published version is a
snapshot, so a docs refresh only reaches users when you publish.

```bash
# 1. bump
cd servers/fluentcart-developer
npm version patch          # or minor / major

# 2. build + probe (prepublishOnly forces this anyway)
npm run build && npm run verify

# 3. ship
npm publish
```

`prepack` runs `scripts/copy-skills.mjs`, which copies `references/` into
`dist/skills/` and **refuses to publish fewer than 500 pages**. That guard is
deliberate: a half-synced corpus should fail the release, not ship.

---

## Adding a new section

When FluentCart adds a documentation area, nothing needs editing —
`/hashmap.json` picks it up automatically and the new pages land under
`references/<section>/`.

The two things that may need a human:

1. **A new URL the hashmap cannot derive.** Add it to `URL_OVERRIDES` with a
   comment saying why. The sync prints `FAIL … HTTP 404` for each one it hits.
2. **A page listed but not published.** Add it to `KNOWN_MISSING` so the run
   stays green, and note the date.

Update the section map in `skills/fluentcart-developer/SKILL.md` when a new
top-level section appears, so the agent knows where to look.

---

## The five files that are never touched

`premium-references.json` lists files that are **not** from the vendor site —
they document FastrSoft's own work and are withheld from public builds:

```
fastr-addon-hooks.md
fastr-addon-schema.md
client-integration-contract.md
trial-abuse-prevention.md
device-licensing-and-hardware-tracking.md
```

The sync writes to `.vendor-docs/`, and only the *copy* step fills
`references/`. Preserve these five when the folder is cleared, restore them
after, then rebuild `references/INDEX.md`.

---

## Known traps, ranked by wasted time

| Symptom | Cause |
| --- | --- |
| Corpus is 76% empty | OpenAPI fallback disabled — check any `restapi/operations` file, under 700 bytes means a shell |
| Operation pages titled with the URL path | Title not taken from the OpenAPI `summary` |
| A handful of 404s | `_`→`/` derivation on a filename containing a real underscore |
| Body truncated mid-document | Regexed the `</div>` instead of balancing nested divs |
| Headings missing from output | Files are CRLF and the regex anchors on `$` |
| Dead links in the mirror | `.html` links not rewritten to `.md` |
| Server warns on boot about file counts | MCP skills catalog caps at 512 files; raise `limits.files` |
| Served docs are stale | `prepack` did not re-run, so `dist/skills/` is older than `references/` |
