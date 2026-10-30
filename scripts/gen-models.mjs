#!/usr/bin/env node
// Generate skills/fluentcart-developer/references/models-complete-index.md from
// the published model documentation.
//
// database-models-reference.md is the deep dive: 22 hand-written models with
// relationships, casts, scopes and worked queries. The docs publish 41 models,
// and the ones it left out were not peripheral — Product, Customer, Subscription
// and Coupon had no entry anywhere in the skill, so "what columns does Product
// have?" had no answer. This index answers that for every model, and points at
// the deep dive where one exists.
//
//   node scripts/gen-models.mjs            # write the file
//   node scripts/gen-models.mjs --check    # exit 1 if it is stale

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REFS = path.join(ROOT, 'skills/fluentcart-developer/references');
const TARGET = path.join(REFS, 'models-complete-index.md');
const DOCS = 'https://dev.fluentcart.com';

const MODELS = [
  'activity', 'applied-coupon', 'attribute-group', 'attribute-relation', 'attribute-term',
  'cart', 'coupon', 'customer', 'customer-addresses', 'customer-meta', 'label',
  'label-relationship', 'license', 'license-activation', 'license-meta', 'license-site',
  'order', 'order-address', 'order-download-permission', 'order-item', 'order-meta',
  'order-operation', 'order-promotion', 'order-promotion-stat', 'order-tax-rate',
  'order-transaction', 'product', 'product-detail', 'product-download', 'product-meta',
  'product-variation', 'scheduled-action', 'shipping-class', 'shipping-method',
  'shipping-zone', 'subscription', 'subscription-meta', 'tax-class', 'tax-rate', 'user',
  'user-meta'
];

function decode(s) {
  return s
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/​/g, '');
}

function text(html) {
  return decode(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

/** Every table on the page as { headers, rows } of plain strings. */
function tables(html) {
  const out = [];
  for (const chunk of html.split(/<table\b/).slice(1)) {
    const slice = chunk.slice(0, chunk.indexOf('</table>') + 1 || undefined);
    const headers = [...slice.matchAll(/<th\b[^>]*>([\s\S]*?)<\/th>/g)].map((m) => text(m[1]));
    const body = slice.split(/<tbody\b/)[1] ?? slice;
    const rows = [];
    for (const tr of body.split(/<tr\b/).slice(1)) {
      const cells = [...tr.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/g)].map((m) => text(m[1]));
      if (cells.length) rows.push(cells);
    }
    out.push({ headers, rows });
  }
  return out;
}

/** h2 sections with their html, so "Attributes" and "Relationships" can be found. */
function sections(html) {
  const parts = html.split(/<h2\b[^>]*>/i).slice(1);
  return parts.map((p) => {
    const title = text(p.slice(0, p.indexOf('</h2>')));
    return { title, body: p.slice(p.indexOf('</h2>') + 5) };
  });
}

async function mainHtml(slug) {
  const res = await fetch(`${DOCS}/database/models/${slug}.html`, { signal: AbortSignal.timeout(25_000) });
  if (!res.ok) throw new Error(`${slug} -> ${res.status}`);
  const html = await res.text();
  const m = html.match(/<main\b[^>]*>([\s\S]*)<\/main>/i);
  return m ? m[1] : html;
}

const deepDive = new Set(
  [...(await fs.readFile(path.join(REFS, 'database-models-reference.md'), 'utf8')).matchAll(/^### `([A-Za-z]+)`/gm)]
    .map((m) => m[1].toLowerCase())
);

const entries = [];
for (const slug of MODELS) {
  const html = await mainHtml(slug);
  const all = tables(html);
  // The identity card is the first table, and its first row is a <th> pair
  // ("DB Table Name" | "{wp_db_prefix}_fct_orders"), not a <td> row.
  const firstTable = html.split(/<table\b/)[1]?.split('</table>')[0] ?? '';
  const ths = [...firstTable.matchAll(/<th\b[^>]*>([\s\S]*?)<\/th>/g)]
    .map((m) => text(m[1]))
    .filter(Boolean);
  const identity = [...(all[0]?.rows ?? [])];
  if (ths.length >= 2) identity.unshift([ths[0], ths[1]]);
  const get = (label) => identity.find((r) => r[0].toLowerCase() === label)?.[1] ?? '';

  const klass = get('class');
  const name = klass.split('\\').pop() || slug;
  const table = get('db table name');
  const source = get('source file');
  const ns = get('name space');

  const secs = sections(html);
  const attrsSec = secs.find((s) => /^attributes/i.test(s.title));
  const relSec = secs.find((s) => /^(relationships|relations)\b/i.test(s.title));
  const traitsSec = secs.find((s) => /^traits/i.test(s.title));

  const attrs = (attrsSec ? tables(attrsSec.body)[0]?.rows ?? [] : [])
    .map(([n, type, comment]) => ({ n, type, comment }));
  // Relations are one <h3> per relationship, not a table.
  const rels = relSec
    ? [...relSec.body.matchAll(/<h3\b[^>]*>([\s\S]*?)<\/h3>/g)].map((m) => text(m[1]).replace(/\s\^?$/, ''))
    : [];
  const traits = (traitsSec ? tables(traitsSec.body)[0]?.rows ?? [] : []).map(([n]) => n);

  entries.push({
    slug, name, klass, table, source, ns,
    attrs, rels, traits,
    detailed: deepDive.has(name.toLowerCase())
  });
}

const covered = entries.filter((e) => e.detailed).length;
const attrTotal = entries.reduce((n, e) => n + e.attrs.length, 0);

const lines = [];
lines.push('<!--');
lines.push(`Source:    ${DOCS}/database/models`);
lines.push(`Retrieved: ${new Date().toISOString().slice(0, 10)}`);
lines.push('Generated: scripts/gen-models.mjs — do not edit by hand; re-run the generator');
lines.push('-->');
lines.push('');
lines.push('# FluentCart Model Index (complete)');
lines.push('');
lines.push(
  `All **${entries.length} Eloquent models** the developer docs publish — ${attrTotal} attributes across ` +
    `them — with each model's table, class, source file, traits, relationships and columns.`
);
lines.push('');
lines.push(
  `${covered} of these have a full write-up in [database-models-reference.md](database-models-reference.md) ` +
    '(casts, mutators, scopes, query patterns); the entry below links to it. The rest are documented here ' +
    'and nowhere else in the skill — open the source file named on the entry for behaviour.'
);
lines.push('');
lines.push('> Prefix: every table is `{wp_db_prefix}_fct_*`, so on a default install `wp_fct_orders`, etc.');
lines.push('> Amounts are integer minor units (cents). `Helper::toDecimal($amount)` converts for display.');
lines.push('');

for (const e of entries) {
  lines.push(`## \`${e.name}\``);
  lines.push('');
  lines.push(
    `${e.detailed ? '[Full write-up](database-models-reference.md)' : `[source](${DOCS}/database/models/${e.slug}.html)`} · ` +
      `\`\\${e.ns}\\${e.name}\` · \`${e.table || 'WordPress core table'}\` · \`${e.source}\``
  );
  if (e.traits.length) lines.push('', `**Traits:** ${e.traits.map((t) => `\`${t}\``).join(', ')}`);
  if (e.attrs.length) {
    lines.push('', '**Attributes:**', '');
    for (const a of e.attrs) {
      lines.push(`- \`${a.n}\` *(${a.type.replace(/\s+/g, ' ')})*${a.comment ? ` — ${a.comment}` : ''}`);
    }
  }
  if (e.rels.length) lines.push('', `**Relationships:** ${e.rels.map((r) => `\`${r}\``).join(', ')}`);
  lines.push('');
}

const content = lines.join('\n');

if (process.argv.includes('--check')) {
  const current = await fs.readFile(TARGET, 'utf8').catch(() => '');
  const strip = (s) => s.replace(/Retrieved: .*\n/, '');
  if (strip(current) !== strip(content)) {
    console.error('models-complete-index.md is stale — run node scripts/gen-models.mjs');
    process.exit(1);
  }
  console.log('models-complete-index.md is up to date');
} else {
  await fs.writeFile(TARGET, content, 'utf8');
  console.log(
    `wrote ${path.relative(ROOT, TARGET)} — ${entries.length} models, ${attrTotal} attributes ` +
      `(${covered} with a deep dive), ${content.split('\n').length} lines`
  );
}
