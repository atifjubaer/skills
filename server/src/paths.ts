import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Resolve the skills root across every way this package can be executed:
 *
 * 1. `FASTR_SKILLS_DIR` — explicit override (containers, mounted volumes, tests).
 * 2. `__dirname/skills` — bundled copy inside `dist/` when installed from npm.
 * 3. `__dirname/../../skills` — monorepo layout, works for both `src/` (tsx dev)
 *    and `dist/` because both are exactly one level under `server/`.
 */
function candidateRoots(): string[] {
  const roots = [path.resolve(__dirname, 'skills'), path.resolve(__dirname, '../../skills')];
  if (process.env.FASTR_SKILLS_DIR) roots.unshift(path.resolve(process.env.FASTR_SKILLS_DIR));
  return roots;
}

let cachedRoot: string | undefined;

/** Absolute path to the folder holding every Playing Card's skill directory. */
export function skillsRoot(): string {
  if (cachedRoot) return cachedRoot;
  const roots = candidateRoots();
  cachedRoot = roots.find(dir => fs.existsSync(dir)) ?? roots[roots.length - 1];
  return cachedRoot;
}

/** Absolute path to a single skill folder, e.g. `skills/lemonsqueezy-developer`. */
export function skillDir(name: string): string {
  return path.join(skillsRoot(), name);
}

/** Absolute path to a skill's `references/` folder. */
export function skillRefs(name: string): string {
  return path.join(skillDir(name), 'references');
}
