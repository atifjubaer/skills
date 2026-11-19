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

**12 MCP tools**, namespaced `mcp__fluentcart__*`:

| Tool | What it answers |
| --- | --- |
| `fc_search_docs` | Full-text across 588 documentation pages. Every query word must match; optional `prefix` scopes to `restapi/`, `database/`, `hooks/`, `modules/`. |
| `fc_get_reference` | One page by path, or one heading inside it. |
| `fc_search_hooks` | An action or filter by name or domain. |
| `fc_get_db_schema` | One `wp_fct_*` table. |
| `fc_generate_payment_gateway_boilerplate` | A payment gateway class. |
| `fc_generate_licensing_boilerplate` | Software licensing through FluentCart Pro. |
| `fc_generate_customer_endpoint_boilerplate` | A customer dashboard tab. |
| `fc_generate_device_licensing_boilerplate` | Licensing for a desktop app, extension, or CLI. |
| `fc_generate_trial_guard_boilerplate` | A trial guard. |
| `fc_generate_client_sdk` | A Node, .NET, Go, or Kotlin licence client. |
| `fc_generate_native_client` | A native client for a non-WordPress product. |
| `get_info` | Server version and corpus stats. |

**One skill**, `fluentcart-developer`, which tells the model the tools exist,
when to reach for them, and the rules that keep generated code correct — never
patch FluentCart core, prefix everything, guard every PHP file, escape output,
check capabilities.

The skill is deliberately short. The 588 documentation pages are served by the
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

`dsh-plugin-fluentcart` is listed in [`index.json`](./index.json), a
[plugin index](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/guide/plugin-market.md)
in `format: 1`. To use it, open **Plugins → Custom plugin indexes**, add the
raw URL of that file, and install from the **Discover** tab.

Regenerate it after a publish:

```sh
npm run make-index
```

## Development

```sh
npm install
npm test
```

`npm test` mounts the plugin in a real Cordis context, connects the real MCP
server as a real child process, asserts all 12 tools and the skill came back,
and then disposes the fiber. If the teardown were wrong the process would hang
on the child's open stdio pipes instead of exiting — so a passing run also
proves the server is not leaked.

## Licence

MIT. Copyright (c) 2026 Atif Jubaer (Fastrsoft).
