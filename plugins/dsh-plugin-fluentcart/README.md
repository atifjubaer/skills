# dsh-plugin-fluentcart

FluentCart developer knowledge for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness).

One compose row does two jobs: it mounts the `fluentcart` MCP server and
registers the `fluentcart-developer` skill. No `cordis.yml` editing, no
absolute paths, no `npx`.

## Install

```sh
dsh plugin --profile web add dsh-plugin-fluentcart
```

Then boot the profile as usual:

```sh
dsh web
```

The plugin starts the server as a child process with the same Node that runs
the harness, and stops it when the plugin unloads. Nothing is added to `PATH`
and nothing is fetched at runtime.

## What it adds

**6 MCP tools**, namespaced `mcp__fluentcart__*`:

| Tool | What it answers |
| --- | --- |
| `fc_search_docs` | Full-text across 593 documentation pages. Every query word must match; optional `prefix` scopes to `restapi/`, `database/`, `hooks/`, `modules/`. |
| `fc_get_reference` | One page by path, or one heading inside it. |
| `fc_search_hooks` | An action or filter by name or domain. |
| `fc_get_db_schema` | One `wp_fct_*` table. |
| `fc_generate` | Working code. Pass a `type`: `payment_gateway`, `licensing`, `customer_endpoint`, `device_licensing`, `client_sdk` or `native_client`. |
| `get_info` | Server version and corpus stats. |

**One skill**, `fluentcart-developer`, which tells the model the tools exist,
when to reach for them, and the rules that keep generated code correct — never
patch FluentCart core, prefix everything, guard every PHP file, escape output,
check capabilities.

The skill is deliberately short. The 593 documentation pages are served by the
tools, not pasted into the prompt, so a session costs a few hundred tokens
until it actually looks something up.

## Requirements

- DeepSeek Harness `>=0.2.0 <0.3.0`
- Node `>=22`
- No licence key, account, or quota. The server is free for every client.

The `@deepseek-ai/dsh-mcp-client` package is a **peer** dependency: the host's
copy is used, so this plugin never loads a second MCP client beside the one
the harness already runs.

## Configuration

None by default. The one escape hatch is for development against a local
checkout of the server:

```sh
FLUENTCART_MCP_ENTRY=/absolute/path/to/servers/fluentcart-developer/dist/index.js
```

Without it, the server is resolved from this package's own dependencies.

To override the row from your profile instead, add it to
`$DSH_HOME/profiles/<name>/cordis.patch.yml`. Later layers win per row, but a
patch **replaces** the whole `config` value rather than merging into it, so
restate every key you still want.

## Plugin index

Open **Plugins → Custom plugin indexes**, choose **Add index source**, and enter:

```
https://raw.githubusercontent.com/atifjubaer/skills/main/index.json
```

Turn on **Custom plugin indexes** under **Experimental plugins** first — the
Discover tab does not exist without it. Then install from **Discover**.

This is optional. `dsh plugin add dsh-plugin-fluentcart` does not depend on the
index and always works; the index only adds a browsable card.

The index is a [plugin
index](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/guide/plugin-market.md)
in `format: 1`, served straight from this repository. It lives at the
repository root, not here, because an index is a **marketplace**: it lists
every FastrSoft plugin, and this package is one card in it.

### Regenerating

Run from the **repository root**, not this directory:

```sh
npm run make-index
```

Then commit `index.json`. There is no separate publish step — the file is
served from the repository, so committing it *is* publishing it.

Adding a plugin needs no change to the generator. Create `plugins/<name>/` with
a `dsh.bundle` (the compose layer) and a `dsh.marketplace` block (the card
title, description, icon and labels), and the next run picks it up.

The icon is inlined as a `data:` URL by the generator, so the index stays one
self-contained file that works on any static host. The format caps an inline
icon at 32 KiB and this one is 7 KB.

## Development

```sh
npm install
npm test
```

`npm test` mounts the plugin in a real Cordis context, connects the real MCP
server as a real child process, asserts all 6 tools and the skill came back,
and then disposes the fiber. If the teardown were wrong the process would hang
on the child's open stdio pipes instead of exiting — so a passing run also
proves the server is not leaked.

## Licence

MIT. Copyright (c) 2026 Atif Jubaer (Fastrsoft).
