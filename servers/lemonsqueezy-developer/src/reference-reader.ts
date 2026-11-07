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

/** Every `.md` in a skill's references folder, sorted for a stable listing. */
export function listReferences(dir: string): ReferenceListing {
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .sort();

  return {
    files: files.map((file) => {
      const full = path.join(dir, file);
      const stat = fs.statSync(full);
      // Only the head is needed for the title, and some references are large.
      const head = fs.readFileSync(full, 'utf8').slice(0, 2000);
      return { file, bytes: stat.size, title: firstTitle(head, file.replace(/\.md$/, '')) };
    })
  };
}

/**
 * Resolve a caller-supplied name to exactly one file in `dir`, or say why not.
 *
 * Basename-only: a reference reader that honoured `../` would be a filesystem
 * read primitive, and the callers that matter always pass a plain file name.
 */
function resolve(dir: string, requested: string): { file: string } | { error: string } {
  const file = path.basename(requested.trim());
  if (file !== requested.trim()) {
    return { error: `"${requested}" must be a plain file name, without directories.` };
  }
  if (!file.endsWith('.md')) {
    return { error: `"${file}" is not a .md file.` };
  }
  if (fs.existsSync(path.join(dir, file))) return { file };

  // A near miss is common — "rest-api-order.md", "hooks.md" — and listing the
  // real names is more useful than a bare not-found.
  const stem = file.replace(/\.md$/, '').toLowerCase();
  const all = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
  const loose = all.filter((f) => f.toLowerCase().includes(stem));
  if (loose.length === 1) return { file: loose[0] };

  // A singular/plural slip matches several names by substring but only one by
  // prefix — "rest-api-order" should reach rest-api-orders.md, not be reported
  // as ambiguous alongside rest-api-order-bumps.md.
  const prefixed = loose.filter((f) => f.toLowerCase().startsWith(stem));
  if (prefixed.length === 1) return { file: prefixed[0] };

  const near = loose.length ? ` Did you mean: ${loose.join(', ')}?` : '';
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
