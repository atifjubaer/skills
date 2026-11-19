---
name: "fluentcart-developer"
description: "FluentCart developer knowledge for WordPress e-commerce: the 474 REST API operations, 49 database models, 22 hook reference files, 11 modules, payment gateway and shipping carriers, and FluentCart Pro software licensing. Use the fc_* MCP tools to search and read the 588 local documentation pages instead of guessing an endpoint, hook signature, or table name."
summary: "Search and read the full FluentCart developer documentation through the fc_* MCP tools, and generate validated boilerplate for gateways, licensing, customers, device licensing, trial guards and client SDKs."
version: "3.0.0"
license: "MIT"
tags:
  - wordpress
  - ecommerce
  - fluentcart
  - payments
  - licensing
  - php
---

# FluentCart Developer

FluentCart is a WordPress e-commerce plugin. This skill gives you its complete
developer documentation and the tools to generate working boilerplate.

**Do not answer a FluentCart question from memory.** The REST surface, the hook
signatures, and the `wp_fct_*` schema are all specific to this plugin and change
between versions. Look them up.

## Tools

| Tool | Use it for |
| --- | --- |
| `fc_search_docs` | Find the right page. Every query word must match. Optional `prefix` scopes to `restapi/`, `database/`, `hooks/`, `modules/`. |
| `fc_get_reference` | Read one page by path, or one heading inside it. |
| `fc_search_hooks` | Find an action or filter by name or domain. |
| `fc_get_db_schema` | Read one `wp_fct_*` table. |
| `fc_generate_*` | Generate a gateway, licensing, customer endpoint, device licensing, trial guard, or client SDK. |
| `get_info` | Server version and corpus stats. |

## Workflow

1. **Locate.** `fc_search_docs` with the operation or concept. Scope with
   `prefix` when you already know the area — `restapi/` for endpoints,
   `database/` for tables, `hooks/` for actions and filters.
2. **Read.** `fc_get_reference` on the path it returned. Read the whole page
   unless you only need one heading.
3. **Generate or write.** Prefer a `fc_generate_*` tool over hand-writing a
   gateway or licensing class: the generators already encode the required
   hooks, the order they fire in, and the response shapes.
4. **Verify.** Re-read the page your code depends on. A signature you did not
   read is a signature you invented.

## Rules

- **Never modify FluentCart core.** Extend through hooks, filters, and the
  documented extension points. A change to a core file is lost on update and
  is not a supported integration.
- **Prefix everything.** Functions and hooks use your own plugin prefix, never
  `fluentcart_` or `fct_`.
- **Guard every PHP file** with `defined('ABSPATH') || exit;`.
- **Escape output, sanitize input, check capabilities** on every admin action
  and REST route. FluentCart's own routes are the reference for which
  capability each endpoint expects.
- **Read before you generate.** The generators take a `productId`, a class
  prefix, and a namespace; get those from the user, not from a guess.

## Answering

Lead with the code or the endpoint. Cite the documentation path you read, for
example `restapi/operations/orders/get-orders.md`, so the user can check it.
When the docs and the user's existing code disagree, say so instead of
silently picking one.
