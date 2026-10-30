#!/usr/bin/env node
// Generate skills/fluentcart-developer/references/hooks-complete-index.md from
// the published FluentCart hook reference.
//
// The per-topic action-hooks-*.md / filter-hooks-*.md files carry the full
// parameter arrays and worked examples, but they were written by hand and had
// drifted: the docs publish 751 hooks and the files covered about 480, with the
// module and Pro-module pages missing entirely. A complete index closes that gap
// without duplicating the detail — every hook name becomes findable, and the
// entries that do have a detailed write-up link straight to it.
//
//   node scripts/gen-hook-index.mjs            # write the file
//   node scripts/gen-hook-index.mjs --check    # exit 1 if it is stale

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REFS = path.join(ROOT, 'skills/fluentcart-developer/references');
const TARGET = path.join(REFS, 'hooks-complete-index.md');
const DOCS = 'https://dev.fluentcart.com';

/** Every hook page the developer docs publish, in reading order. */
const PAGES = [
  ['actions/admin-and-templates', 'Action Hooks — Admin & Templates', 'action-hooks-admin-templates.md'],
  ['actions/cart-and-checkout', 'Action Hooks — Cart & Checkout', 'action-hooks-cart-checkout.md'],
  ['actions/customers-and-users', 'Action Hooks — Customers & Users', 'action-hooks-customers-users.md'],
  ['actions/licenses', 'Action Hooks — Licenses', 'action-hooks-licenses.md'],
  ['actions/orders', 'Action Hooks — Orders', 'action-hooks-orders.md'],
  ['actions/payments-and-integrations', 'Action Hooks — Payments & Integrations', 'action-hooks-payments-integrations.md'],
  ['actions/products-and-coupons', 'Action Hooks — Products & Coupons', 'action-hooks-products-coupons.md'],
  ['actions/subscriptions', 'Action Hooks — Subscriptions', 'action-hooks-subscriptions.md'],
  ['actions/modules', 'Action Hooks — Modules', null],
  ['actions/pro-modules', 'Action Hooks — Pro Modules', null],
  ['filters/cart-and-checkout', 'Filter Hooks — Cart & Checkout', 'filter-hooks-cart-checkout.md'],
  ['filters/customers-and-subscriptions', 'Filter Hooks — Customers & Subscriptions', 'filter-hooks-customers-subscriptions.md'],
  ['filters/integrations-and-advanced', 'Filter Hooks — Integrations & Advanced', 'filter-hooks-integrations-advanced.md'],
  ['filters/orders-and-payments', 'Filter Hooks — Orders & Payments', 'filter-hooks-orders-payments.md'],
  ['filters/products-and-pricing', 'Filter Hooks — Products & Pricing', 'filter-hooks-products-pricing.md'],
  ['filters/settings-and-configuration', 'Filter Hooks — Settings & Configuration', 'filter-hooks-settings-configuration.md'],
  ['filters/modules', 'Filter Hooks — Modules', null],
  ['filters/pro-modules', 'Filter Hooks — Pro Modules', null]
];

const DEPRECATED_PAGE = 'deprecated';

function decode(s) {
  return s
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function mainHtml(slug) {
  const res = await fetch(`${DOCS}/hooks/${slug}.html`, {
    signal: AbortSignal.timeout(25_000)
  });
  if (!res.ok) throw new Error(`${slug} -> ${res.status}`);
  const html = await res.text();
  const m = html.match(/<main\b[^>]*>([\s\S]*)<\/main>/i);
  return m ? m[1] : html;
}

/** { hook, description, source } for each <h3><code>name</code> + <details>. */
function parseHooks(main) {
  const out = [];
  const blocks = main.split(/<h3\b[^>]*>/).slice(1);
  for (const block of blocks) {
    const summary = block.match(/<summary\b[^>]*>([\s\S]*?)<\/summary>/);
    if (!summary) continue;
    const code = summary[1].match(/<code>([\s\S]*?)<\/code>/);
    if (!code) continue;
    const hook = decode(code[1]);
    if (!hook.includes('/')) continue; // not a hook name

    const desc = decode(summary[1].split('</code>')[1].replace(/^[\s—–-]+/, ''));
    const src = block.match(/<strong>Source:?<\/strong>([\s\S]*?)(?:<\/p>|<\/li>)/);
    out.push({
      hook,
      description: desc,
      source: src ? decode(src[1]).replace(/^[\s:]+/, '').split(' ')[0] : ''
    });
  }
  return out;
}

/** The deprecation page is tables, and its tables have different columns. */
function parseDeprecated(main) {
  // Every heading with the offset it starts at, so a table can name the section
  // it sits under.
  const headings = [...main.matchAll(/<h[23]\b[^>]*>([\s\S]*?)<\/h[23]>/g)].map((m) => ({
    at: m.index,
    text: decode(m[1])
  }));

  const tables = [];
  const re = /<table\b/g;
  let match;
  while ((match = re.exec(main))) {
    const table = main.slice(match.index);
    const end = table.indexOf('</table>');
    const slice = end >= 0 ? table.slice(0, end) : table;

    const headers = [...slice.matchAll(/<th\b[^>]*>([\s\S]*?)<\/th>/g)].map((m) => decode(m[1]));
    const body = slice.split(/<tbody\b/)[1] ?? '';
    const rows = [];
    for (const tr of body.split(/<tr\b/).slice(1)) {
      const cells = [...tr.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/g)].map((m) => decode(m[1]));
      if (cells.length) rows.push(cells);
    }

    const before = headings.filter((h) => h.at < match.index).at(-1);
    tables.push({
      // Section headings on the docs pages end in a zero-width space.
      title: (before ? before.text : `Table ${tables.length + 1}`).replace(/[​\s]+$/, ''),
      headers,
      rows
    });
  }
  return tables;
}

async function build() {
  // Which hooks already have a detailed write-up, and in which file?
  const detailed = new Map();
  for (const file of await fs.readdir(REFS)) {
    if (!/^(action|filter)-hooks-/.test(file)) continue;
    const text = await fs.readFile(path.join(REFS, file), 'utf8');
    for (const m of text.matchAll(/fluent_cart\/[a-zA-Z0-9_/{}$-]+/g)) {
      const hook = m[0].replace(/[.,;:)]+$/, '');
      if (!detailed.has(hook)) detailed.set(hook, file);
    }
  }

  const sections = [];
  const all = [];
  for (const [slug, title, detailFile] of PAGES) {
    const hooks = parseHooks(await mainHtml(slug));
    if (!hooks.length) continue;
    sections.push({ slug, title, detailFile, hooks });
    all.push(...hooks);
  }

  const deprecated = parseDeprecated(await mainHtml(DEPRECATED_PAGE));

  const unique = new Set(all.map((h) => h.hook));
  const covered = [...unique].filter((h) => detailed.has(h)).length;

  const lines = [];
  lines.push('<!--');
  lines.push(`Source:    ${DOCS}/hooks/actions  and  ${DOCS}/hooks/filters`);
  lines.push(`Retrieved: ${retrievedDate()}`);
  lines.push('Generated: scripts/gen-hook-index.mjs — do not edit by hand; re-run the generator');
  lines.push('-->');
  lines.push('');
  lines.push('# FluentCart Hook Index (complete)');
  lines.push('');
  lines.push(
    `Every hook published in the FluentCart developer docs: **${unique.size} hooks** across ` +
      `${sections.length} pages, including the module and Pro-module hooks that have no per-topic ` +
      `reference file and the deprecated names that still fire.`
  );
  lines.push('');
  lines.push(
    `This is the lookup table, not the manual. ${covered} of these hooks have a full write-up — ` +
      'parameter arrays, payload shapes and worked examples — in the per-topic files, and the entry ' +
      'below links to it. The rest are documented here by name, purpose and source file; open the ' +
      'plugin source at that path for the exact payload.'
  );
  lines.push('');
  lines.push('> Amounts are integer minor units (cents). `Helper::toDecimal($amount)` converts for display.');
  lines.push('');

  for (const { slug, title, detailFile, hooks } of sections) {
    lines.push(`## ${title}`);
    lines.push('');
    if (detailFile) {
      lines.push(`Full parameters and examples: [${detailFile}](${detailFile}) · [source](${DOCS}/hooks/${slug}.html)`);
    } else {
      lines.push(`[source](${DOCS}/hooks/${slug}.html)`);
    }
    lines.push('');
    for (const h of hooks) {
      const where = detailed.get(h.hook) ? ` → [${detailed.get(h.hook)}](${detailed.get(h.hook)})` : '';
      const src = h.source ? ` *(\`${h.source}\`)*` : '';
      lines.push(`- **\`${h.hook}\`** — ${h.description || '—'}${src}${where}`);
    }
    lines.push('');
  }

  if (deprecated.length) {
    lines.push('## Deprecated & Removed Hooks');
    lines.push('');
    lines.push(`[source](${DOCS}/hooks/${DEPRECATED_PAGE}.html)`);
    lines.push('');
    lines.push(
      'FluentCart retires a hook through `do_action_deprecated()` / `apply_filters_deprecated()` for at ' +
        'least one release before removing it. While deprecated the old name still fires, so existing ' +
        'integrations keep working, but it logs a notice. Check this table before trusting an old name.'
    );
    lines.push('');
    for (const table of deprecated) {
      lines.push(`### ${table.title}`);
      lines.push('');
      lines.push(`| ${table.headers.join(' | ')} |`);
      lines.push(`| ${table.headers.map(() => '---').join(' | ')} |`);
      for (const row of table.rows) {
        lines.push(`| ${row.map((c) => (c ? `\`${c}\`` : '—')).join(' | ')} |`);
      }
      lines.push('');
    }
  }

  return {
    content: lines.join('\n'),
    unique: unique.size,
    covered,
    deprecated: deprecated.reduce((n, t) => n + t.rows.length, 0)
  };
}

function retrievedDate() {
  return new Date().toISOString().slice(0, 10);
}

const { content, unique, covered, deprecated } = await build();

if (process.argv.includes('--check')) {
  const current = await fs.readFile(TARGET, 'utf8').catch(() => '');
  const strip = (s) => s.replace(/Retrieved: .*\n/, '');
  if (strip(current) !== strip(content)) {
    console.error('hooks-complete-index.md is stale — run node scripts/gen-hook-index.mjs');
    process.exit(1);
  }
  console.log('hooks-complete-index.md is up to date');
} else {
  await fs.writeFile(TARGET, content, 'utf8');
  console.log(
    `wrote ${path.relative(ROOT, TARGET)} — ${unique} hooks (${covered} with a detailed write-up), ` +
      `${deprecated} deprecation rows, ${content.split('\n').length} lines`
  );
}
