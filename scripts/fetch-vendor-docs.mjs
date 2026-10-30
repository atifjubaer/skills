#!/usr/bin/env node
// Fetch the vendor documentation the skills are built from.
//
// The reference files under skills/ are curated, but their facts come from four
// public doc sites. Without a snapshot there is no way to tell a page that
// changed from a page that did not, so every refresh starts from memory and
// ends in a rewrite. This script downloads all four into .vendor-docs/ (ignored
// by git) with a manifest of URL, size and content hash, so the next refresh
// can diff two snapshots and touch only what actually moved.
//
//   node scripts/fetch-vendor-docs.mjs            # fetch everything
//   node scripts/fetch-vendor-docs.mjs --only=lemonsqueezy-api
//
// Output:
//   .vendor-docs/<source-id>/<slug>.txt   page text, tags stripped
//   .vendor-docs/manifest.json            url, status, bytes, sha256, fetchedAt

import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, '..', '.vendor-docs');

const CONCURRENCY = 4;
const TIMEOUT_MS = 25_000;
const MAX_PAGES = 250;
const USER_AGENT = 'skills-repo-docs-sync/1.0 (+https://github.com/atifjubaer/skills)';

const SOURCES = [
  {
    id: 'lemonsqueezy-api',
    root: 'https://docs.lemonsqueezy.com/api',
    crawl: (url) => url.pathname.startsWith('/api')
  },
  {
    id: 'lemonsqueezy-help',
    root: 'https://docs.lemonsqueezy.com/help',
    crawl: (url) => url.pathname.startsWith('/help')
  },
  {
    id: 'fluentcart-docs',
    sitemap: 'https://docs.fluentcart.com/sitemap.xml',
    crawl: () => true
  },
  {
    id: 'fluentcart-dev',
    root: 'https://dev.fluentcart.com/',
    crawl: (url) => url.pathname.endsWith('.html'),
    // The REST API reference pages are client-rendered from OpenAPI fragments,
    // so their HTML carries no text at all — but every one of them names a
    // specUrl, and the URL is a straight mapping from the page path. Fetching
    // the fragments gives the authoritative method, path, parameters and
    // schema for all ~161 operations, which no amount of HTML scraping would.
    specs: (url) =>
      url.includes('/restapi/operations/')
        ? url.replace('/restapi/operations/', '/openapi/public/').replace(/\.html$/, '.json')
        : null
  }
];

/**
 * Visible text only.
 *
 * All three doc sites render their content inside <main> and put navigation in
 * <nav>/<aside>/<header>/<footer>, so reading <main> and dropping the landmarks
 * yields the page rather than the page plus 800 words of sidebar repeated on
 * every URL in the site. Falls back to the whole document when a page has no
 * <main>.
 */
function toText(html) {
  const main = html.match(/<main\b[^>]*>([\s\S]*)<\/main>/i);
  return (main ? main[1] : html)
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<(nav|aside|header|footer)\b[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/[ \t\f\v]+/g, ' ')
    .replace(/\s*\n\s*/g, '\n')
    .trim();
}

async function get(url) {
  const res = await fetch(url, {
    redirect: 'follow',
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { 'user-agent': USER_AGENT }
  });
  return { res, body: await res.text() };
}

/** Follow same-site links from a root page until the pipeline runs dry. */
async function crawl(rootUrl, accept) {
  const start = new URL(rootUrl);
  const seen = new Set();
  const queue = [rootUrl];
  const pages = [];

  while (queue.length && pages.length < MAX_PAGES) {
    const batch = queue.splice(0, CONCURRENCY);
    const results = await Promise.all(
      batch.map(async (url) => {
        if (seen.has(url)) return null;
        seen.add(url);
        try {
          const { res, body } = await get(url);
          if (!res.ok) return { url, status: res.status, body: '' };
          const found = [...body.matchAll(/href="([^"#?]+)"/g)]
            .map((m) => {
              try {
                return new URL(m[1], url).href;
              } catch {
                return null;
              }
            })
            .filter((u) => u && new URL(u).origin === start.origin && accept(new URL(u)));
          return { url, status: res.status, body, found };
        } catch (err) {
          return { url, status: 0, body: '', error: err.message };
        }
      })
    );

    for (const r of results) {
      if (!r) continue;
      if (r.body) pages.push({ url: r.url, status: r.status, html: r.body });
      for (const link of r.found ?? []) if (!seen.has(link)) queue.push(link);
    }
  }
  return pages;
}

async function fromSitemap(sitemapUrl) {
  const { res, body } = await get(sitemapUrl);
  if (!res.ok) throw new Error(`sitemap ${sitemapUrl} -> ${res.status}`);
  // Sitemap URLs are XML-escaped; "tax-&amp;-duties" in a path must reach the
  // server as "tax-&-duties" or every page under it 404s.
  const urls = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
    m[1].trim().replace(/&amp;/g, '&')
  );
  const pages = [];
  for (let i = 0; i < urls.length; i += CONCURRENCY) {
    const batch = urls.slice(i, i + CONCURRENCY);
    const results = await Promise.all(
      batch.map(async (url) => {
        try {
          const { res: r, body: html } = await get(url);
          return r.ok ? { url, status: r.status, html } : { url, status: r.status, html: '' };
        } catch (err) {
          return { url, status: 0, html: '', error: err.message };
        }
      })
    );
    pages.push(...results);
  }
  return pages;
}

function slugFor(url) {
  const u = new URL(url);
  const p = (u.pathname + u.search).replace(/\/+$/, '') || '/index';
  return p.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'index';
}

async function main() {
  const only = process.argv.find((a) => a.startsWith('--only='))?.slice('--only='.length);
  const sources = only ? SOURCES.filter((s) => s.id === only) : SOURCES;
  if (!sources.length) throw new Error(`no source matches --only=${only}`);

  await fs.mkdir(OUT, { recursive: true });
  // Merge into any previous manifest so `--only=` refreshes one source without
  // discarding the record of the others.
  const manifestPath = path.join(OUT, 'manifest.json');
  let previous = {};
  try {
    previous = JSON.parse(await fs.readFile(manifestPath, 'utf8')).sources ?? {};
  } catch {
    /* first run */
  }
  const manifest = { fetchedAt: new Date().toISOString(), sources: { ...previous } };

  for (const source of sources) {
    process.stdout.write(`\n${source.id}\n`);
    const pages = source.sitemap ? await fromSitemap(source.sitemap) : await crawl(source.root, source.crawl);
    const dir = path.join(OUT, source.id);
    await fs.mkdir(dir, { recursive: true });

    const entries = [];
    for (const page of pages) {
      const text = page.html ? toText(page.html) : '';
      const slug = slugFor(page.url);
      if (text) await fs.writeFile(path.join(dir, `${slug}.txt`), text, 'utf8');
      entries.push({
        url: page.url,
        slug,
        status: page.status,
        bytes: page.html.length,
        chars: text.length,
        sha256: crypto.createHash('sha256').update(text).digest('hex').slice(0, 16),
        error: page.error
      });
    }

    if (source.specs) {
      const specs = pages.map((p) => source.specs(p.url)).filter(Boolean);
      const specDir = path.join(OUT, `${source.id}-openapi`);
      await fs.mkdir(specDir, { recursive: true });
      const specEntries = [];
      for (let i = 0; i < specs.length; i += CONCURRENCY) {
        const batch = specs.slice(i, i + CONCURRENCY);
        const got = await Promise.all(
          batch.map(async (url) => {
            try {
              const { res, body } = await get(url);
              return { url, status: res.status, body: res.ok ? body : '' };
            } catch (err) {
              return { url, status: 0, body: '', error: err.message };
            }
          })
        );
        for (const g of got) {
          const slug = slugFor(g.url);
          if (g.body) await fs.writeFile(path.join(specDir, `${slug}.json`), g.body, 'utf8');
          specEntries.push({
            url: g.url,
            slug,
            status: g.status,
            bytes: g.body.length,
            sha256: crypto.createHash('sha256').update(g.body).digest('hex').slice(0, 16),
            error: g.error
          });
        }
      }
      specEntries.sort((a, b) => a.url.localeCompare(b.url));
      manifest.sources[`${source.id}-openapi`] = specEntries;
      const okSpecs = specEntries.filter((e) => e.status === 200 && e.bytes > 0).length;
      console.log(`  ${okSpecs}/${specEntries.length} OpenAPI fragments saved to .vendor-docs/${source.id}-openapi/`);
    }

    entries.sort((a, b) => a.url.localeCompare(b.url));
    manifest.sources[source.id] = entries;
    const ok = entries.filter((e) => e.status === 200 && e.chars > 0).length;
    const failed = entries.filter((e) => e.status !== 200 || e.chars === 0);
    console.log(`  ${ok}/${entries.length} pages saved to .vendor-docs/${source.id}/`);
    for (const f of failed.slice(0, 5)) console.log(`  ! ${f.status} ${f.url}`);
  }

  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  const total = Object.values(manifest.sources).reduce((n, e) => n + e.length, 0);
  console.log(`\n${total} pages, manifest at .vendor-docs/manifest.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
