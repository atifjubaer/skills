// Validates every skill folder and the skills.sh registry.
//
// The rule that bites in practice: the MCP skills extension requires a
// frontmatter `name` of lowercase letters, digits and single hyphens, and it
// silently skips the whole skill when the name is wrong — only a stderr line
// is printed. This script turns that silent skip into a red build.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKILLS_DIR = path.join(root, 'skills');
const NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const errors = [];
const warnings = [];

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

/** Minimal YAML frontmatter reader: top-level `key: value` pairs only. */
function readFrontmatter(file) {
  const text = fs.readFileSync(file, 'utf8');
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;

  const fields = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kv) continue;
    fields[kv[1]] = kv[2].replace(/^["']|["']$/g, '').trim();
  }
  return fields;
}

function validateSkillFile(file, expectedName, label) {
  if (!fs.existsSync(file)) {
    fail(`${label}: SKILL.md is missing`);
    return;
  }

  const fields = readFrontmatter(file);
  if (!fields) {
    fail(`${label}: no YAML frontmatter block`);
    return;
  }

  if (!fields.name) {
    fail(`${label}: frontmatter has no "name"`);
  } else if (fields.name !== expectedName) {
    fail(`${label}: frontmatter name "${fields.name}" must equal "${expectedName}"`);
  } else if (!NAME_RE.test(fields.name) || fields.name.length > 64) {
    fail(`${label}: name "${fields.name}" must be 1-64 chars of lowercase letters, digits and single hyphens`);
  }

  if (!fields.description || fields.description.length < 20) {
    fail(`${label}: description is missing or shorter than 20 characters`);
  }
}

// ---------------------------------------------------------------- skill folders
const skillFolders = fs.existsSync(SKILLS_DIR)
  ? fs.readdirSync(SKILLS_DIR, { withFileTypes: true }).filter(d => d.isDirectory() && !d.name.startsWith('.'))
  : [];

if (skillFolders.length === 0) {
  fail(`no skill folders found under ${path.relative(root, SKILLS_DIR)}`);
}

for (const folder of skillFolders) {
  validateSkillFile(path.join(SKILLS_DIR, folder.name, 'SKILL.md'), folder.name, `skills/${folder.name}`);
}

// ------------------------------------------------------------- registry entries
const registryPath = path.join(root, 'skills.sh.json');
let listed = new Set();

if (!fs.existsSync(registryPath)) {
  fail('skills.sh.json is missing');
} else {
  try {
    const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
    const groups = registry.groupings ?? [];
    if (!Array.isArray(groups) || groups.length === 0) fail('skills.sh.json: "groupings" is empty');

    for (const group of groups) {
      if (!group.title) fail('skills.sh.json: a grouping has no title');
      for (const name of group.skills ?? []) {
        if (listed.has(name)) {
          fail(`skills.sh.json: "${name}" is listed twice`);
        }
        listed.add(name);
        if (!skillFolders.some(d => d.name === name)) {
          fail(`skills.sh.json: "${name}" is listed but skills/${name}/ does not exist`);
        }
      }
    }
  } catch (err) {
    fail(`skills.sh.json is not valid JSON: ${err.message}`);
  }
}

for (const folder of skillFolders) {
  if (!listed.has(folder.name)) warn(`skills/${folder.name} exists but is not listed in skills.sh.json`);
}

// ---------------------------------------------------- published package entry
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const rootSkill = path.join(root, 'SKILL.md');
if (fs.existsSync(rootSkill)) {
  validateSkillFile(rootSkill, packageJson.name, 'root SKILL.md');
}

// ---------------------------------------------------------------------- report
for (const message of warnings) console.log(`WARN  ${message}`);
for (const message of errors) console.error(`FAIL  ${message}`);

if (errors.length > 0) {
  console.error(`\n${errors.length} error(s), ${warnings.length} warning(s)`);
  process.exit(1);
}

console.log(`\n${skillFolders.length} skill folder(s) valid, ${listed.size} registry entr(ies) checked, ${warnings.length} warning(s)`);
