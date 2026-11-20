/**
 * Generates every client the FluentCart MCP tools can emit, into servers/fluentcart-developer/samples-out/.
 *
 * This exists so CI can COMPILE the output. The protocol probe in
 * verify-stdio.mjs asserts that a template contains expected substrings, which
 * cannot see a doubled function declaration — four generators shipped
 * non-compiling code while that suite reported 41/41.
 *
 * Run from the repository root after `npm --prefix servers/fluentcart-developer run build`:
 *   node scripts/gen-samples.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'servers/fluentcart-developer/dist/cards/fluentcart/tools.js');

if (!fs.existsSync(dist)) {
  console.error(`missing build output: ${dist}\nrun: npm --prefix servers/fluentcart-developer run build`);
  process.exit(1);
}

const { registerFluentCartTools } = await import(pathToFileURL(dist).href);

const handlers = new Map();
registerFluentCartTools({
  registerTool(name, _schema, handler) {
    handlers.set(name, handler);
  },
});

const outDir = path.join(root, 'servers/fluentcart-developer/samples-out');
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const STORE = 'https://store.example.com/';
const PRODUCT = 101;
const APP = 'Sample App';

const CLIENT_FILES = {
  node: 'license.ts',
  dotnet: 'LicenseClient.cs',
  go: 'LicenseClient.go',
  kotlin: 'LicenseClient.kt',
};

const NATIVE_FILES = {
  swift: 'LicenseClient.swift',
  unity_csharp: 'FastrLicense.cs',
  java: 'FastrLicense.java',
  php: 'FastrLicense.php',
  c: 'fastr_license.c',
};


function extract(result) {
  if (typeof result === 'string') return result;

  if (Array.isArray(result?.content)) {
    return result.content
      .filter((part) => part && part.type === 'text')
      .map((part) => part.text)
      .join('\n');
  }

  if (typeof result?.text === 'string') return result.text;

  throw new Error('cannot extract code from tool result');
}

async function generate(tool, args) {
  const handler = handlers.get(tool);

  if (!handler) {
    throw new Error(`tool not registered: ${tool}`);
  }

  const out = extract(await handler(args));

  if (out.trim() === '') {
    throw new Error(`${tool} returned empty output for ${JSON.stringify(args)}`);
  }

  return out;
}

let written = 0;

for (const [platform, file] of Object.entries(CLIENT_FILES)) {
  const code = await generate('fc_generate', {
    type: 'client_sdk',
    platform,
    storeUrl: STORE,
    productId: PRODUCT,
    appName: APP,
  });

  fs.writeFileSync(path.join(outDir, file), code, 'utf8');
  console.log(`client ${platform.padEnd(14)} ${String(code.split('\n').length).padStart(4)} lines  ${file}`);
  written++;
}

for (const [platform, file] of Object.entries(NATIVE_FILES)) {
  const code = await generate('fc_generate', {
    type: 'native_client',
    platform,
    storeUrl: STORE,
    productId: PRODUCT,
    appName: APP,
  });

  fs.writeFileSync(path.join(outDir, file), code, 'utf8');
  console.log(`native ${platform.padEnd(14)} ${String(code.split('\n').length).padStart(4)} lines  ${file}`);
  written++;
}

// The trial_guard generator was removed: it required the Fastr Devices add-on,
// so it was the one type that could not run against a plain FluentCart store.

console.log(`\n${written} artefacts written to ${path.relative(root, outDir)}`);
