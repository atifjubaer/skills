import fs from 'node:fs';
import path from 'node:path';

/**
 * A skill's knowledge lives in `references/*.md`, but an MCP client can only
 * reach what a tool exposes. Before this module the FluentCart card had three
 * tools and between them they could read one reference file; the other 48 —
 * every `rest-api-*.md`, `database-models-reference.md`, `payment-gateway-
 * integration.md` — were invisible. The agent was told to "open the reference"
 * by a SKILL.md it could load, and had no way to obey.
 *
 * One generic reader fixes that for every card. It is deliberately dumb: list,
 * read, or pull one section out of one file. The value is that the file list is
 * real and the section index is cheap, so a caller can find its way into a
 * 3,000-line reference without loading all of it.
 */

/** Enough for a full reference section, small enough to be a safe tool result. */
export const MAX_REFERENCE_CHARS = 14_000;

export interface ReferenceEntry {
  file: string;
  bytes: number;
  /** First markdown h1, stripped of `#`, so the list is readable without opening files. */
  title: string;
}

export interface ReferenceListing {
  files: ReferenceEntry[];
}

export interface ReferenceSlice {
  file: string;
  title: string;
  /** Every `##`/`###` heading in the file, so the caller can ask for one. */
  sections: string[];
  text: string;
  truncated: boolean;
}

/**
 * The reference files are checked out with CRLF on Windows, and every heading
 * regex below anchors on `$`. Without this, `.` cannot consume the `\r` left by
 * `split('\n')` and no heading ever matches — a silent failure that looks like
 * "the section does not exist".
 */
function normalise(markdown: string): string {
  return markdown.replace(/\r\n/g, '\n');
}

function firstTitle(markdown: string, fallback: string): string {
  const h1 = normalise(markdown).match(/^#\s+(.+)$/m);
  return h1 ? h1[1].trim() : fallback;
}

function headings(markdown: string): string[] {
  return [...normalise(markdown).matchAll(/^(#{2,3})\s+(.+)$/gm)].map((m) => `${m[1]} ${m[2].trim()}`);
}

/**
 * Every `.md` under a skill's references folder, as `/`-separated relative paths.
 *
 * The corpus mirrors the documentation site (`hooks/filters.md`,
 * `restapi/orders.md`), so this recurses. Paths are normalised to `/` rather
 * than the host separator so a Windows checkout and a Linux container answer
 * with the same names.
 */
export function listReferences(dir: string): ReferenceListing {
  const walk = (current: string, prefix: string): string[] => {
    const out: string[] = [];
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isDirectory()) out.push(...walk(path.join(current, entry.name), rel));
      else if (entry.name.endsWith('.md')) out.push(rel);
    }
    return out;
  };

  return {
    files: walk(dir, '')
      .sort()
      .map((file) => {
        const full = path.join(dir, ...file.split('/'));
        const stat = fs.statSync(full);
        // Only the head is needed for the title, and some references are large.
        const head = fs.readFileSync(full, 'utf8').slice(0, 2000);
        return { file, bytes: stat.size, title: firstTitle(head, file.replace(/\.md$/, '')) };
      })
  };
}

/**
 * Resolve a caller-supplied path to exactly one file in `dir`, or say why not.
 *
 * Relative subpaths are allowed because the corpus mirrors the site, but `.`
 * and `..` are rejected outright: a reference reader that honoured `../` would
 * be a filesystem read primitive, and every legitimate caller passes a path
 * that stays inside `references/`.
 */
function resolve(dir: string, requested: string): { file: string } | { error: string } {
  const cleaned = requested.trim().replace(/^\/+/, '');
  if (!cleaned.endsWith('.md')) {
    return { error: `"${cleaned}" is not a .md file.` };
  }

  const parts = cleaned.split('/');
  if (parts.some((p) => p === '..' || p === '.' || p === '')) {
    return { error: `"${requested}" must be a relative path inside references/.` };
  }

  const file = parts.join('/');
  if (fs.existsSync(path.join(dir, ...parts))) return { file };

  // A near miss is common — "rest-api-order", "filters" — and listing the real
  // names is more useful than a bare not-found.
  const all = listReferences(dir).files.map((f) => f.file);
  const stem = file.replace(/\.md$/, '').toLowerCase();
  const loose = all.filter((f) => f.toLowerCase().includes(stem));
  if (loose.length === 1) return { file: loose[0] };

  // A singular/plural slip matches several names by substring but only one by
  // prefix — "rest-api-order" should reach restapi/orders.md, not be reported
  // as ambiguous alongside restapi/order-bumps.md.
  const prefixed = loose.filter((f) => f.toLowerCase().startsWith(stem));
  if (prefixed.length === 1) return { file: prefixed[0] };

  const near = loose.length ? ` Did you mean: ${loose.slice(0, 8).join(', ')}?` : '';
  return { error: `No reference file named "${file}".${near}` };
}

/**
 * Cut out one `##`/`###` section, from its heading to the next heading of the
 * same or higher level. Returns null when no heading matches, so the caller can
 * fall back to the whole document rather than silently receiving nothing.
 */
function sliceSection(markdown: string, section: string): string | null {
  const wanted = section.trim().toLowerCase().replace(/^#+\s*/, '');
  const lines = normalise(markdown).split('\n');

  let start = -1;
  let level = 0;
  for (let i = 0; i < lines.length; i += 1) {
    const m = lines[i].match(/^(#{2,4})\s+(.+)$/);
    if (!m) continue;
    if (m[2].toLowerCase().replace(/[`*]/g, '').includes(wanted)) {
      start = i;
      level = m[1].length;
      break;
    }
  }
  if (start === -1) return null;

  for (let i = start + 1; i < lines.length; i += 1) {
    const m = lines[i].match(/^(#{2,4})\s+/);
    if (m && m[1].length <= level) return lines.slice(start, i).join('\n').trim();
  }
  return lines.slice(start).join('\n').trim();
}

export function readReference(
  dir: string,
  requested: string,
  section?: string
): ReferenceSlice | { error: string } {
  const resolved = resolve(dir, requested);
  if ('error' in resolved) return resolved;

  const markdown = fs.readFileSync(path.join(dir, resolved.file), 'utf8');
  const sections = headings(markdown);

  let text = markdown;
  if (section) {
    const sliced = sliceSection(markdown, section);
    if (sliced === null) {
      return {
        error:
          `No section matching "${section}" in ${resolved.file}. ` +
          `Sections: ${sections.join(' | ')}`
      };
    }
    text = sliced;
  }

  const truncated = text.length > MAX_REFERENCE_CHARS;
  return {
    file: resolved.file,
    title: firstTitle(markdown, resolved.file),
    sections,
    text: truncated
      ? `${text.slice(0, MAX_REFERENCE_CHARS)}\n\n[truncated at ${MAX_REFERENCE_CHARS} chars — ` +
        `re-run with a "section" to read a smaller slice of ${resolved.file}]`
      : text,
    truncated
  };
}

// -------------------------------------------------------------------- search

export interface SearchHit {
  file: string;
  title: string;
  line: number;
  heading: string;
  snippet: string;
  score: number;
}

export interface SearchResult {
  query: string;
  scanned: number;
  hits: SearchHit[];
}

export interface SearchOptions {
  limit?: number;
  /** Restrict to files whose path starts with this, e.g. `restapi/`. */
  prefix?: string;
}

interface CorpusDoc {
  file: string;
  title: string;
  lines: string[];
}

/**
 * The corpus is a few megabytes and one search touches all of it, so it is read
 * once per process rather than per call. A sync rewrites the files and the
 * server starts again against them, so there is nothing to invalidate here.
 */
const corpusCache = new Map<string, CorpusDoc[]>();

function corpus(dir: string): CorpusDoc[] {
  const cached = corpusCache.get(dir);
  if (cached) return cached;

  const docs = listReferences(dir).files.map((entry) => {
    const full = path.join(dir, ...entry.file.split('/'));
    return {
      file: entry.file,
      title: entry.title,
      lines: normalise(fs.readFileSync(full, 'utf8')).split('\n')
    };
  });
  corpusCache.set(dir, docs);
  return docs;
}

/**
 * Rank whole lines, not documents. Someone asking for `void renewal` wants the
 * endpoint page and the heading that name it, not the eleven pages that happen
 * to mention both words once somewhere in the body.
 */
export function searchReferences(
  dir: string,
  query: string,
  opts: SearchOptions = {}
): SearchResult {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return { query, scanned: 0, hits: [] };

  const limit = Math.min(Math.max(opts.limit ?? 20, 1), 100);
  const docs = corpus(dir).filter((d) => !opts.prefix || d.file.startsWith(opts.prefix));

  const hits: SearchHit[] = [];

  for (const doc of docs) {
    let heading = doc.title;
    for (let i = 0; i < doc.lines.length; i += 1) {
      const raw = doc.lines[i];
      if (raw.trim().length === 0) continue;

      const h = raw.match(/^(#{1,4})\s+(.+)$/);
      if (h) heading = h[2].trim();

      const low = raw.toLowerCase();
      if (!terms.every((t) => low.includes(t))) continue;

      // A heading that matches beats a body line that does; a matching filename
      // beats both.
      let score = 1;
      if (h) score += 4;
      if (heading.toLowerCase().includes(terms[0])) score += 2;
      if (doc.file.toLowerCase().includes(terms[0])) score += 3;
      for (const t of terms) score += Math.min(low.split(t).length - 1, 3);

      hits.push({
        file: doc.file,
        title: doc.title,
        line: i + 1,
        heading,
        snippet: raw.trim().slice(0, 220),
        score
      });
    }
  }

  hits.sort((a, b) => b.score - a.score || a.file.localeCompare(b.file));
  return { query, scanned: docs.length, hits: hits.slice(0, limit) };
}
