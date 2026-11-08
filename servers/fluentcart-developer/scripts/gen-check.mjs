// Boots the built server over stdio and prints two generated clients, so a
// template change can be inspected and compiled without going through npm.
//
//   node scripts/gen-check.mjs <out-dir>

import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverRoot = path.resolve(__dirname, '..');
const outDir = process.argv[2] || path.join(serverRoot, 'tmp-gen');

function boot() {
  const child = spawn(process.execPath, [path.join(serverRoot, 'dist', 'index.js')], {
    cwd: serverRoot,
    stdio: ['pipe', 'pipe', 'pipe'],
    env: { ...process.env }
  });

  let buffer = '';
  const pending = new Map();
  let nextId = 1;

  child.stdout.on('data', (chunk) => {
    buffer += chunk.toString();
    let nl;
    while ((nl = buffer.indexOf('\n')) !== -1) {
      const line = buffer.slice(0, nl).trim();
      buffer = buffer.slice(nl + 1);
      if (!line) continue;
      let msg;
      try {
        msg = JSON.parse(line);
      } catch {
        continue;
      }
      if (msg.id && pending.has(msg.id)) {
        pending.get(msg.id)(msg);
        pending.delete(msg.id);
      }
    }
  });

  const request = (method, params = {}) => {
    const id = nextId++;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`timeout on ${method}`)), 20000);
      pending.set(id, (msg) => {
        clearTimeout(timer);
        resolve(msg);
      });
      child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n');
    });
  };

  return { request, close: () => child.kill() };
}

const s = boot();

try {
  await s.request('initialize', {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: { name: 'gen-check', version: '1.0.0' }
  });
  s.request('notifications/initialized', {}).catch(() => {});

  const grab = (res) => {
    const text = res?.result?.content?.[0]?.text;
    if (!text) throw new Error('no text in tool result: ' + JSON.stringify(res).slice(0, 300));
    return text;
  };

  const storeUrl = 'https://wordpress.test';
  const productId = 14;
  const appName = 'Fastr Test App';

  const node = grab(
    await s.request('tools/call', {
      name: 'fc_generate_client_sdk',
      arguments: { platform: 'node', storeUrl, productId, appName }
    })
  );

  const tauri = grab(
    await s.request('tools/call', {
      name: 'fc_generate_device_licensing_boilerplate',
      arguments: { platform: 'tauri_rust', storeUrl, productId, appName }
    })
  );

  mkdirSync(outDir, { recursive: true });
  writeFileSync(path.join(outDir, 'license.ts'), node);
  writeFileSync(path.join(outDir, 'licensing.rs'), tauri);

  console.log(`node client:  ${node.length} bytes -> ${path.join(outDir, 'license.ts')}`);
  console.log(`tauri client: ${tauri.length} bytes -> ${path.join(outDir, 'licensing.rs')}`);
} finally {
  s.close();
}
