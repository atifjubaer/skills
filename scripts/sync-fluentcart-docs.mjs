#!/usr/bin/env node
// Capture every page of the FluentCart developer docs as Markdown.
//
// The site is VitePress, so the whole inventory is machine-readable and nothing
// has to be clicked:
//
//   1. /hashmap.json        maps every source `page.md` to its chunk hash —
//                           the authoritative page count (585 as of 2026-11).
//   2. __VP_SITE_DATA__     embedded in any page: the nav + sidebar config with
//                           canonical `link` values (566), which resolves slugs
//                           that contain a literal underscore. Guessing `_` -> `/`
//                           cannot, because `payment_setting_fields.md` is one
//                           filename, not three directories.
//
// Each page's rendered body lives in `div.vp-doc` and is converted to Markdown
// here: headings, fenced code with its language, tables, lists, links, emphasis
// and VitePress custom blocks. That is the same content the site's own
// "Copy Docs" button hands you, except there are 585 of them and no clicking.
//
//   node scripts/sync-fluentcart-docs.mjs              # capture all pages
//   node scripts/sync-fluentcart-docs.mjs --limit 5    # smoke test
//   node scripts/sync-fluentcart-docs.mjs --dry-run    # inventory only
//
// Output (git-ignored):
//   .vendor-docs/fluentcart-dev/<path>.md       one file per page
//   .vendor-docs/fluentcart-dev/_manifest.json  url, status, bytes, sha256, title

import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, '..', '.vendor-docs', 'fluentcart-dev');
const ORIGIN = 'https://dev.fluentcart.com';
const CONCURRENCY = 6;
const TIMEOUT_MS = 30_000;
const USER_AGENT = 'fluentcart-docs-sync/1.0 (+https://github.com/atifjubaer/skills)';

const args = process.argv.slice(2);
const flag = name => args.includes(`--${name}`);
const valueOf = name => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : null;
};
const DRY_RUN = flag('dry-run');
const LIMIT = Number(valueOf('limit') ?? 0);

/**
 * URLs the hashmap cannot derive. Two shapes:
 *
 *   - a case difference: `database_readme.md` is served as `/database/README`
 *   - a literal underscore in a filename: `payment_setting_fields` is one file,
 *     not three directories, so `_` -> `/` invents a 404
 *
 * Verified by hand against the live site; see the failure list in the README.
 */
const URL_OVERRIDES = {
  '/database/readme': '/database/README',
  '/payment-methods-integration/payment/setting/fields':
    '/payment-methods-integration/payment_setting_fields'
};

/**
 * Listed in the hashmap but not published: `/engineering/authoring` 404s at
 * every spelling tried (`authoring`, `authoring.html`, `authoring-guide`), and
 * the engineering landing page links only to `adding-custom-pages`. Reported as
 * skipped rather than failed so a full sync stays green.
 */
const KNOWN_MISSING = new Set(['/engineering/authoring']);

/** Section landing pages are hand-built: no `div.vp-doc` to convert. */
const LANDING = new Set(['/engineering/']);

// ----------------------------------------------------------------- fetch

async function get(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'user-agent': USER_AGENT, accept: 'text/html,application/json' }
    });
    const body = await res.text();
    return {
      status: res.status,
      url: res.url || url,
      body,
      type: res.headers.get('content-type') ?? ''
    };
  } finally {
    clearTimeout(timer);
  }
}

async function pool(items, worker, concurrency = CONCURRENCY) {
  const results = new Array(items.length);
  let next = 0;
  const runners = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    for (;;) {
      const i = next++;
      if (i >= items.length) return;
      results[i] = await worker(items[i], i);
    }
  });
  await Promise.all(runners);
  return results;
}

// ------------------------------------------------------------- inventory

/** Every source page, from the VitePress hash map. */
async function hashmapKeys() {
  const res = await get(`${ORIGIN}/hashmap.json`);
  if (res.status !== 200) throw new Error(`hashmap.json -> HTTP ${res.status}`);
  return Object.keys(JSON.parse(res.body));
}

/** Canonical links from the serialised theme config, read off any one page. */
async function siteDataLinks() {
  const res = await get(`${ORIGIN}/getting-started`);
  if (res.status !== 200) throw new Error(`getting-started -> HTTP ${res.status}`);
  const h = res.body;

  const tag = '__VP_SITE_DATA__=JSON.parse(';
  const i = h.indexOf(tag);
  if (i < 0) return new Set();

  const start = i + tag.length;
  const BS = String.fromCharCode(92);
  let j = start + 1;
  let end = -1;
  while (j < h.length) {
    if (h[j] === BS) {
      j += 2;
      continue;
    }
    if (h[j] === '"') {
      end = j;
      break;
    }
    j++;
  }
  if (end < 0) return new Set();

  const data = JSON.parse(JSON.parse(h.slice(start, end + 1)));
  const links = new Set();
  const walk = node => {
    if (Array.isArray(node)) return node.forEach(walk);
    if (node && typeof node === 'object') {
      if (typeof node.link === 'string') links.add(node.link);
      for (const key of Object.keys(node)) walk(node[key]);
    }
  };
  walk(data.themeConfig);
  return links;
}

/** Canonical link -> the output path it should be stored under. */
function linkToPath(link) {
  let p = link.split('#')[0].split('?')[0];
  if (p.endsWith('.md')) p = p.slice(0, -3);
  p = p.replace(/^\/+/, '').replace(/\/+$/, '');
  if (p === '') p = 'index';
  return `${p}.md`;
}

/** Mirrors `_` -> `/` as a last resort, for pages the sidebar does not list. */
function deriveFromKey(key) {
  return `/${key.replace(/\.md$/, '').replace(/_/g, '/')}`;
}

// ------------------------------------------------------- html -> markdown

const decode = s =>
  s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');

const stripTags = s => s.replace(/<[^>]+>/g, '');

function inline(html) {
  let s = html;

  // VitePress anchors every heading with a trailing `#` link; drop it.
  s = s.replace(/<a class="header-anchor"[\s\S]*?<\/a>/g, '');
  s = s.replace(/<button[\s\S]*?<\/button>/g, '');

  // Inline code first, so its contents are not touched by later rules.
  s = s.replace(/<code[^>]*>([\s\S]*?)<\/code>/g, (_, c) => '`' + decode(stripTags(c)) + '`');

  s = s.replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/g, '**$2**');
  s = s.replace(/<(em|i)[^>]*>([\s\S]*?)<\/\1>/g, '*$2*');
  s = s.replace(/<del[^>]*>([\s\S]*?)<\/del>/g, '~~$1~~');

  s = s.replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g, (_, href, text) => {
    const label = text.trim();
    return label ? `[${label}](${href})` : '';
  });

  // The corpus is read offline, so rewrite the site's `.html` page links to the
  // `.md` neighbours that actually exist on disk.
  s = s.replace(/\]\(([^)\s#]+)\.html(#[^)]*)?\)/g, (m, href, hash) =>
    `](${href}.md${hash ?? ''})`
  );

  s = s.replace(/<br\s*\/?>/g, '\n');
  s = stripTags(s);
  return decode(s).replace(/[ \t]+/g, ' ').trim();
}

function table(md) {
  const rows = [...md.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)].map(m =>
    [...m[1].matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/g)].map(c =>
      inline(c[1]).replace(/\|/g, '\\|')
    )
  );
  if (rows.length === 0) return '';
  const width = Math.max(...rows.map(r => r.length));
  const pad = r => [...r, ...Array(width - r.length).fill('')];
  const [head, ...body] = rows;
  const lines = [`| ${pad(head).join(' | ')} |`, `| ${Array(width).fill('---').join(' | ')} |`];
  for (const row of body) lines.push(`| ${pad(row).join(' | ')} |`);
  return `\n\n${lines.join('\n')}\n\n`;
}

function codeBlock(html) {
  const langMatch = html.match(/class="language-([\w-]+)"/);
  const lang = langMatch ? langMatch[1] : '';
  const code = html.match(/<pre[^>]*>[\s\S]*?<code[^>]*>([\s\S]*?)<\/code>/);
  const body = code ? decode(stripTags(code[1])) : decode(stripTags(html));
  const run = body.includes('```') ? '~~~' : '```';
  return `\n\n${run}${lang}\n${body.replace(/\n+$/, '')}\n${run}\n\n`;
}

function list(html, ordered) {
  const items = [...html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map(m => inline(m[1]));
  if (items.length === 0) return '';
  const lines = items.map((t, i) => `${ordered ? `${i + 1}.` : '-'} ${t}`);
  return `\n\n${lines.join('\n')}\n\n`;
}

/**
 * Convert the inner HTML of `div.vp-doc` to Markdown.
 *
 * Runs outside-in: block constructs are pulled out first and replaced by
 * placeholders holding their finished Markdown, inline formatting is applied to
 * whatever is left, then the placeholders are restored.
 */
function htmlToMarkdown(html) {
  const held = [];
  const keep = text => {
    held.push(text);
    return `\n\n\u0000${held.length - 1}\u0000\n\n`;
  };

  let s = html;

  // Code blocks (Shiki) and bare <pre>.
  s = s.replace(/<div class="language-[\s\S]*?<\/div>/g, m => keep(codeBlock(m)));
  s = s.replace(/<pre[\s\S]*?<\/pre>/g, m => keep(codeBlock(m)));

  // VitePress custom containers: tip / warning / danger / info.
  s = s.replace(/<div class="custom-block ([\w-]+)"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/g, (_, kind, inner) => {
    const title = (inner.match(/<p class="custom-block-title"[^>]*>([\s\S]*?)<\/p>/) || [])[1];
    const rest = inner.replace(/<p class="custom-block-title"[\s\S]*?<\/p>/, '');
    const label = title ? `${inline(title)} — ` : '';
    return keep(`\n\n> **${kind.toUpperCase()}** ${label}${inline(rest)}\n\n`);
  });

  // Tables.
  s = s.replace(/<table[\s\S]*?<\/table>/g, m => keep(table(m)));

  // Lists.
  s = s.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/g, m => keep(list(m, true)));
  s = s.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/g, m => keep(list(m, false)));

  // Headings.
  for (let level = 1; level <= 6; level++) {
    const re = new RegExp(`<h${level}[^>]*>([\\s\\S]*?)<\\/h${level}>`, 'g');
    s = s.replace(re, (_, inner) => keep(`\n\n${'#'.repeat(level)} ${inline(inner)}\n\n`));
  }

  // Blockquotes.
  s = s.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/g, (_, inner) =>
    keep(`\n\n> ${inline(inner)}\n\n`)
  );

  // Paragraphs.
  s = s.replace(/<p[^>]*>([\s\S]*?)<\/p>/g, (_, inner) => {
    const text = inline(inner);
    return text ? `\n\n${text}\n\n` : '';
  });

  s = s.replace(/<hr\s*\/?>/g, '\n\n---\n\n');
  s = inline(s);

  // Restore placeholders, then collapse runs of blank lines.
  let out = s;
  for (let pass = 0; pass < 3; pass++) {
    out = out.replace(/\u0000(\d+)\u0000/g, (_, n) => held[Number(n)]);
  }
  return out
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Slice out `div.vp-doc` by balancing div tags — the page has many others. */
function extractBody(html) {
  const m = html.match(/<div[^>]*class="vp-doc[^"]*"[^>]*>/);
  if (!m) return null;
  const start = m.index + m[0].length;
  let depth = 1;
  let i = start;
  while (i < html.length && depth > 0) {
    const open = html.indexOf('<div', i);
    const close = html.indexOf('</div>', i);
    if (close < 0) break;
    if (open >= 0 && open < close) {
      depth++;
      i = open + 4;
    } else {
      depth--;
      i = close + 6;
    }
  }
  return { body: html.slice(start, i - 6) };
}

function titleOf(html, fallback) {
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  if (h1) {
    const text = inline(h1[1]);
    if (text) return text;
  }
  const t = html.match(/<title>([\s\S]*?)<\/title>/);
  return t ? decode(stripTags(t[1])).replace(/\s*\|\s*FluentCart.*$/, '').trim() : fallback;
}

// ------------------------------------------------------ openapi -> markdown

/**
 * Render one OpenAPI 3 fragment as Markdown.
 *
 * The 449 `restapi/operations/*` pages are built client-side from these
 * fragments, so their HTML ships an empty `div.vp-doc` — the page is a shell.
 * The fragment is the real content: method, route, parameters, request body and
 * every response code.
 */
function openApiToMarkdown(spec) {
  const out = [];
  const methods = ['get', 'post', 'put', 'patch', 'delete'];

  for (const [route, item] of Object.entries(spec.paths ?? {})) {
    for (const method of methods) {
      const op = item[method];
      if (!op) continue;

      out.push(`## \`${method.toUpperCase()} ${route}\``, '');
      if (op.summary) out.push(`**${op.summary}**`, '');
      if (op.description) out.push(op.description.trim(), '');
      if (op.operationId) out.push(`- **operationId:** \`${op.operationId}\``);
      if (Array.isArray(op.tags) && op.tags.length) out.push(`- **tags:** ${op.tags.join(', ')}`);
      out.push('');

      const params = [...(item.parameters ?? []), ...(op.parameters ?? [])];
      if (params.length) {
        out.push(
          '### Parameters',
          '',
          '| Name | In | Required | Type | Description |',
          '| --- | --- | --- | --- | --- |'
        );
        for (const p of params) {
          const schema = p.schema ?? {};
          const desc = String(p.description ?? '')
            .replace(/\|/g, '\\|')
            .replace(/\s*\n\s*/g, ' ');
          out.push(
            `| \`${p.name}\` | ${p.in ?? ''} | ${p.required ? 'yes' : 'no'} | ` +
              `${schema.type ?? ''} | ${desc} |`
          );
        }
        out.push('');
      }

      const content = op.requestBody?.content;
      if (content) {
        const [type] = Object.keys(content);
        out.push('### Request body', '', `\`${type}\``, '');
        const schema = content[type]?.schema;
        if (schema) {
          out.push('```json', JSON.stringify(schema, null, 2), '```', '');
        }
      }

      if (op.responses) {
        out.push('### Responses', '', '| Status | Description |', '| --- | --- |');
        for (const [code, res] of Object.entries(op.responses)) {
          const desc = String(res.description ?? '')
            .replace(/\|/g, '\\|')
            .replace(/\s*\n\s*/g, ' ');
          out.push(`| \`${code}\` | ${desc} |`);
        }
        out.push('');
      }
    }
  }

  return out.join('\n').trim();
}

// ------------------------------------------------------------------- main

const keys = await hashmapKeys();
const links = await siteDataLinks();

console.log(`hashmap pages : ${keys.length}`);
console.log(`sidebar links : ${links.size}`);

// Canonical links win; hashmap keys supply anything the sidebar omits.
const targets = new Map();
for (const link of links) {
  if (!link.startsWith('/') || link === '/' || link.endsWith('.md')) continue;
  targets.set(link, linkToPath(link));
}
for (const key of keys) {
  const derived = deriveFromKey(key);
  if (!targets.has(derived)) targets.set(derived, linkToPath(derived));
}

// Swap in the corrected URL, keeping the derived path as where it is stored.
for (const [bad, good] of Object.entries(URL_OVERRIDES)) {
  if (!targets.has(bad)) continue;
  const rel = targets.get(bad);
  targets.delete(bad);
  targets.set(good, rel);
}

const urls = [...targets.keys()].sort();

// Two different URLs can resolve to the same output path; the second write
// would silently overwrite the first, so say so before capturing.
const byPath = new Map();
for (const [url, rel] of targets) {
  if (byPath.has(rel)) {
    console.warn(`collision: ${byPath.get(rel)} and ${url} -> ${rel}`);
    continue;
  }
  byPath.set(rel, url);
}
console.log(`pages to fetch: ${urls.length}`);

if (DRY_RUN) {
  for (const u of urls) console.log(`  ${u}`);
  process.exit(0);
}

const selected = LIMIT > 0 ? urls.slice(0, LIMIT) : urls;
await fs.mkdir(OUT, { recursive: true });

const manifest = [];
let failures = 0;

await pool(selected, async url => {
  const short = url.padEnd(52);
  let res = await get(`${ORIGIN}${url}`);
  let usedUrl = url;

  // A few pages only resolve with the literal `.html` suffix.
  if (res.status !== 200) {
    const alt = await get(`${ORIGIN}${url}.html`);
    if (alt.status === 200) {
      res = alt;
      usedUrl = `${url}.html`;
    }
  }

  if (res.status !== 200) {
    if (KNOWN_MISSING.has(url)) {
      console.log(`skip ${short} in hashmap, not published`);
      manifest.push({ url, status: res.status, skipped: 'known-missing' });
      return;
    }
    console.log(`FAIL ${short} HTTP ${res.status}`);
    failures++;
    manifest.push({ url, status: res.status });
    return;
  }

  const extracted = extractBody(res.body);

  // Hand-built landing pages carry no documentation body; record where they are
  // rather than converting a page shell into a wall of navigation text.
  if (!extracted) {
    const title = titleOf(res.body, url);
    const rel = targets.get(url);
    const dest = path.join(OUT, rel);
    const stub = `# ${title}\n\n> Hand-built landing page — this section has no\n> converter-friendly body. Source: ${ORIGIN}${usedUrl}\n`;
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.writeFile(dest, stub, 'utf8');
    manifest.push({
      url: usedUrl,
      file: rel,
      status: res.status,
      title,
      bytes: Buffer.byteLength(stub, 'utf8'),
      kind: 'landing',
      fetchedAt: new Date().toISOString()
    });
    console.log(`ok   ${short} (landing page stub)`);
    return;
  }

  let markdown = htmlToMarkdown(extracted.body);
  let title = titleOf(extracted.body, url);
  const rel = targets.get(url);
  const dest = path.join(OUT, rel);

  // The REST operation pages are built client-side from OpenAPI fragments, so
  // their HTML ships an empty body. When the capture is a shell, fetch the
  // fragment instead — it is the actual documentation for that endpoint.
  const opMatch = url.match(/^\/restapi\/operations\/(.+)$/);
  if (opMatch && markdown.length < 200) {
    const spec = await get(`${ORIGIN}/openapi/public/${opMatch[1]}.json`);
    if (spec.status === 200) {
      try {
        const rendered = openApiToMarkdown(JSON.parse(spec.body));
        if (rendered) {
          markdown = rendered;
          // The shell's h1 is the route path; the spec's summary is the name
          // the page is actually about.
          const summary = rendered.match(/^\*\*(.+?)\*\*$/m);
          if (summary) title = summary[1];
        }
      } catch {
        // Leave the stub: the byte count in the summary will show it.
      }
    }
  }

  await fs.mkdir(path.dirname(dest), { recursive: true });
  // The converter already emits the page's own `h1`; only add a title when the
  // body has none, so headings are never doubled.
  const doc = /^#\s/.test(markdown) ? markdown : `# ${title}\n\n${markdown}`;
  await fs.writeFile(dest, `${doc}\n`, 'utf8');

  const size = Buffer.byteLength(markdown, 'utf8');
  manifest.push({
    url: usedUrl,
    file: rel,
    status: res.status,
    title,
    bytes: size,
    sha256: crypto.createHash('sha256').update(markdown).digest('hex').slice(0, 16),
    fetchedAt: new Date().toISOString()
  });
  console.log(`ok   ${short} ${String(size).padStart(7)} B  ${title.slice(0, 44)}`);
});

manifest.sort((a, b) => a.url.localeCompare(b.url));
await fs.writeFile(
  path.join(OUT, '_manifest.json'),
  JSON.stringify({ origin: ORIGIN, capturedAt: new Date().toISOString(), pages: manifest }, null, 2),
  'utf8'
);

const bytes = manifest.reduce((n, m) => n + (m.bytes ?? 0), 0);
console.log(
  `\n${manifest.length - failures}/${manifest.length} pages captured, ${(bytes / 1024).toFixed(0)} KB Markdown`
);
if (failures > 0) {
  console.error(`${failures} page(s) failed`);
  process.exit(1);
}
