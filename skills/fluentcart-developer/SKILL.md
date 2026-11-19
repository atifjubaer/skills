---
name: "fluentcart-developer"
description: "Complete FluentCart developer documentation — every page of dev.fluentcart.com captured as local Markdown: 585 pages covering the 474 REST API operations, 49 database models, 22 hook files, 11 modules, payment-method integration, shipping carriers, and the licensing SDK, plus FastrSoft's own add-on and licensing notes."
summary: "The full FluentCart developer documentation as local Markdown — REST API, database models, action and filter hooks, modules, payment gateways, and shipping."
version: "3.0.0"
license: "MIT"
tags:
  - wordpress
  - ecommerce
  - fluentcart
  - payments
  - licensing
  - php
keywords:
  - fluentcart
  - wordpress e-commerce
  - fluentcart rest api
  - fluentcart hooks
  - fluentcart database models
  - software licensing sdk
  - payment gateways
  - custom shipping
use_cases:
  - Finding the exact REST endpoint, method and payload for any FluentCart operation
  - Looking up action and filter hook signatures by domain
  - Reading the schema of any FluentCart Eloquent model or wp_fct_ table
  - Building custom payment gateways, shipping carriers, and fee surcharges
  - Monetizing and licensing WordPress plugins and themes via FluentCart Pro
---

# FluentCart Developer Skill

This skill is the **complete documentation of FluentCart**, captured from
<https://dev.fluentcart.com> and stored locally as Markdown. It is a mirror of
the vendor's own documentation — not a summary, not a paraphrase.

**588 pages** live under [`references/`](references/INDEX.md), laid out exactly as
the documentation site lays them out. If a page exists on the site, it exists
here under the same path.

---

## How to find anything

Never guess a hook name, an endpoint, a column, or a parameter. The corpus is
complete, so the answer is almost always a file read away.

1. **Start at the index** — [`references/INDEX.md`](references/INDEX.md) lists
   every page, grouped by section.
2. **Match the question to a section** using the map below.
3. **Open the page.** With the MCP server attached, call `fc_get_reference` with
   the path; without it, read the file directly.

### Section map

| Section | Path prefix | Pages | What it answers |
| --- | --- | --- | --- |
| REST API operations | `references/restapi/operations/` | 449 | One page per endpoint: method, route, parameters, payload, response |
| REST API modules | `references/restapi/` | 25 | Per-domain API overviews (orders, products, tax, shipping, licensing…) |
| Database | `references/database/` | 49 | Every `wp_fct_*` model, its columns, relationships, and the query builder |
| Hooks | `references/hooks/` | 22 | Action and filter hooks, split by domain, plus the deprecated list |
| API overview | `references/api/` | 11 | Authentication and the older API surface |
| Modules | `references/modules/` | 11 | Fee system, order bumps, licensing, refunds, shipping, storage, subscriptions |
| Guides | `references/guides/` | 9 | Frontend, integrations, subscriptions, and the shipping-carrier tutorial |
| Payment methods | `references/payment-methods-integration/` | 4 | Building a gateway, field settings, and the Paddle worked example |
| Engineering | `references/engineering/` | 3 | Authoring notes and adding custom pages to the customer dashboard |
| Basics | `references/index.md`, `references/getting-started.md` | 2 | Orientation and the core concepts |

### FastrSoft originals

Five files at the root of `references/` are **not** from the vendor site. They
document FastrSoft's own FluentCart work and must not be treated as vendor
specification:

- [`references/fastr-addon-hooks.md`](references/fastr-addon-hooks.md)
- [`references/fastr-addon-schema.md`](references/fastr-addon-schema.md)
- [`references/client-integration-contract.md`](references/client-integration-contract.md)
- [`references/trial-abuse-prevention.md`](references/trial-abuse-prevention.md)
- [`references/device-licensing-and-hardware-tracking.md`](references/device-licensing-and-hardware-tracking.md)

---

## Working rules

- **Quote what the docs say, not what FluentCart "probably" does.** These files
  are the vendor's own words. If the corpus does not cover something, say so
  rather than inferring from a neighbouring page.
- **Cite the page.** When you give a hook signature or an endpoint, name the
  file it came from so the developer can check it.
- **Prefer the specific page.** `restapi/operations/orders/list-orders.md` beats
  `restapi/orders.md` whenever the question is about one endpoint.
- **The corpus is offline.** Internal links were rewritten from `.html` to
  `.md`, so they resolve inside this folder.

---

## Refreshing the corpus

The pages are generated, never hand-edited — a hand edit is lost on the next
sync:

```bash
npm run sync:docs          # re-capture every page from dev.fluentcart.com
```

The sync enumerates the site through its VitePress `hashmap.json` and sidebar
data, so it never crawls blindly or misses an unlinked page. See
`scripts/sync-fluentcart-docs.mjs`.
