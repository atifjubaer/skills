// End-to-end stdio protocol probe. Boots the built server exactly the way an
// MCP client does and asserts: handshake, the complete tool set, a real call
// against every tool, the bundled skill catalogue, and the modern-era discovery
// path.
//
// This server is free, so there is no tier matrix to probe. What replaces it is
// the opposite assertion: an anonymous session must see every tool.
import { spawn } from 'node:child_process';
import crypto from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverRoot = path.resolve(__dirname, '..');
const entry = path.join(serverRoot, 'dist', 'index.js');
const pkg = JSON.parse(readFileSync(path.join(serverRoot, 'package.json'), 'utf8'));

const results = [];
function check(name, pass, detail = '') {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? `  — ${detail}` : ''}`);
}

const MODERN_META = {
  'io.modelcontextprotocol/protocolVersion': '2026-07-28',
  'io.modelcontextprotocol/clientInfo': { name: 'verify', version: '1.0.0' },
  'io.modelcontextprotocol/clientCapabilities': {}
};

function openSession() {
  const child = spawn(process.execPath, [entry], {
    cwd: serverRoot,
    stdio: ['pipe', 'pipe', 'pipe'],
    env: { ...process.env }
  });

  let buffer = '';
  const pending = new Map();
  const stderr = [];
  let nextId = 1;

  child.stderr.on('data', chunk => stderr.push(chunk.toString()));
  child.stdout.on('data', chunk => {
    buffer += chunk.toString();
    let newline;
    while ((newline = buffer.indexOf('\n')) !== -1) {
      const line = buffer.slice(0, newline).trim();
      buffer = buffer.slice(newline + 1);
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

  function request(method, params = {}) {
    const id = nextId++;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`timeout on ${method}`)), 20000);
      pending.set(id, msg => {
        clearTimeout(timer);
        resolve(msg);
      });
      child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n');
    });
  }

  return {
    request,
    stderr,
    close: () => child.kill()
  };
}

/**
 * A tool that rejects its own arguments replies with `isError` and a short
 * "Input validation error" string, which is still a non-empty result. Without
 * this prefix a length-based assertion would read a schema rejection as a
 * successful probe — the exact way a verifier goes green on a broken tool.
 */
async function call(s, name, args = {}) {
  const res = await s.request('tools/call', { name, arguments: args });
  const text = res.result?.content?.[0]?.text ?? '';
  if (res.result?.isError) return `ERROR: ${text}`;
  return text;
}

const TOOLS = [
  "ls_search_docs",
  "ls_get_schema",
  "ls_get_reference",
  "ls_verify_webhook",
  "ls_validate_license"
];
const ALL_TOOLS = [...TOOLS, 'get_info'];

// ------------------------------------------------------------ free session
{
  const s = openSession();
  try {
    const init = await s.request('initialize', {
      protocolVersion: '2025-06-18',
      capabilities: {},
      clientInfo: { name: 'verify', version: '1.0.0' }
    });
    const info = init.result?.serverInfo;
    check('initialize', Boolean(info), `${info?.name}@${info?.version}`);
    check('serverInfo name', info?.name === 'lemonsqueezy-developer', info?.name);
    check(
      'serverInfo version matches package.json',
      info?.version === pkg.version,
      `${info?.version} vs ${pkg.version}`
    );

    s.request('notifications/initialized', {}).catch(() => {});

    const listed = await s.request('tools/list', {});
    const names = (listed.result?.tools ?? []).map(t => t.name);
    const missing = ALL_TOOLS.filter(t => !names.includes(t));
    const unexpected = names.filter(t => !ALL_TOOLS.includes(t));
    check(`all ${ALL_TOOLS.length} tools registered`, missing.length === 0, missing.join(', ') || `${names.length} tools`);
    check('no unexpected tools', unexpected.length === 0, unexpected.join(', ') || 'none');
    check('no duplicate registration', names.length === ALL_TOOLS.length, `${names.length} of ${ALL_TOOLS.length}`);

    // The bundled skill must be reachable over MCP, not just present on disk.
    const skillList = await s.request('skills/list', {});
    const skillNames = (skillList.result?.skills ?? []).map(x => x.frontmatter?.name ?? '');
    check('skills/list exposes lemonsqueezy-developer', skillNames.includes('lemonsqueezy-developer'), skillNames.join(', ') || 'none');

    {
      const text = await call(s, 'ls_search_docs', {"query":"signature","category":"webhooks"});
      check('call ls_search_docs', text.length > 100, text ? `${text.length} chars` : 'empty');
    }
    {
      const text = await call(s, 'ls_get_schema', {"endpoint":"subscriptions"});
      check('call ls_get_schema', text.length > 50, text ? `${text.length} chars` : 'empty');
    }
    {
      const text = await call(s, 'ls_get_reference', {"file":"webhooks-and-security.md"});
      check('call ls_get_reference', text.length > 100, text ? `${text.length} chars` : 'empty');
    }
    {
      const secret = 'whsec_test_secret';
      const body = JSON.stringify({ meta: { event_name: 'order_created' }, data: { id: '1' } });
      const digest = crypto.createHmac('sha256', secret).update(body).digest('hex');

      const valid = await call(s, 'ls_verify_webhook', { rawBody: body, signatureHeader: digest, signingSecret: secret });
      check('ls_verify_webhook accepts a valid HMAC', valid.includes('"valid": true'), valid.slice(0, 80));

      const tampered = await call(s, 'ls_verify_webhook', {
        rawBody: body.replace('order_created', 'order_refunded'),
        signatureHeader: digest,
        signingSecret: secret
      });
      check('ls_verify_webhook rejects a tampered body', tampered.includes('"valid": false'), tampered.slice(0, 80));

      const section = await call(s, 'ls_get_reference', { file: 'webhooks-and-security.md', section: 'Webhook Event Catalog' });
      check('call ls_get_reference section', section.includes('subscription_payment_refunded'), `${section.length} chars`);
    }

    // Path traversal must be refused, not silently resolved.
    const traversal = await s.request('tools/call', {
      name: 'ls_get_reference',
      arguments: { file: '../paths.ts' }
    });
    check('reference reader rejects traversal', traversal.result?.isError === true);

    const infoText = await call(s, 'get_info');
    const parsed = JSON.parse(infoText);
    check('get_info reports free', parsed.session?.tier === 'free' && parsed.price === 'free', parsed.session?.transport);
    check('get_info counts every tool', parsed.tools?.total === ALL_TOOLS.length, `${parsed.tools?.total} tools`);
    check('get_info card', parsed.card === 'lemonsqueezy', parsed.card);
    check('no crash on stderr', s.stderr.join('').trim() === '', s.stderr.join('').trim().slice(0, 120) || 'clean');
  } catch (err) {
    check('free session', false, err.message);
  } finally {
    s.close();
  }
}

// ------------------------------------------------ modern era (2026-07-28)
{
  const s = openSession();
  try {
    const discover = await s.request('server/discover', { _meta: MODERN_META });
    const versions = discover.result?.supportedVersions ?? [];
    check('modern: server/discover', versions.length > 0, versions.join(', '));

    const tools = await s.request('tools/list', { _meta: MODERN_META });
    const names = (tools.result?.tools ?? []).map(t => t.name);
    const missing = ALL_TOOLS.filter(t => !names.includes(t));
    check('modern: stateless tools/list', missing.length === 0, missing.join(', ') || `${names.length} tools`);
  } catch (err) {
    check('modern session', false, err.message);
  } finally {
    s.close();
  }
}


// ------------------------------------------------------------ HTTP transport
// The stdio probe above never loads `http.ts`, which is exactly how both
// packages shipped a /health endpoint that still called itself the retired
// suite and advertised both cards. This boots the real HTTP entry and reads
// back what it reports.
{
  const port = 8100 + (process.pid % 400);
  const child = spawn(process.execPath, [path.join(serverRoot, "dist", "http.js")], {
    cwd: serverRoot,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, PORT: String(port) }
  });
  const deadline = Date.now() + 15000;
  let body = null;
  try {
    while (Date.now() < deadline) {
      try {
        const res = await fetch("http://127.0.0.1:" + port + "/health");
        if (res.ok) { body = await res.json(); break; }
      } catch {
        // not listening yet
      }
      await new Promise(r => setTimeout(r, 250));
    }
    check("http: /health reachable", body !== null);
    if (body) {
      check("http: /health names this package", body.server === "lemonsqueezy-developer", body.server);
      check("http: /health reports its own card", body.card === "lemonsqueezy", body.card);
      check("http: /health version matches package.json", body.version === pkg.version, String(body.version));
      check("http: /health advertises no other card", body.cards === undefined, JSON.stringify(body.cards));
    }
  } finally {
    child.kill();
  }
}

const failed = results.filter(r => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length === 0 ? 0 : 1);
