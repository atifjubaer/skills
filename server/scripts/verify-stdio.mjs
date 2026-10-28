// End-to-end stdio protocol probe. Boots the built server exactly the way an
// MCP client does and asserts: handshake, tier gating, skills catalog, tool
// calls, and the 2026-07-28 (modern era) discovery path.
import { spawn } from 'node:child_process';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverRoot = path.resolve(__dirname, '..');
const entry = path.join(serverRoot, 'dist', 'index.js');

const results = [];
function check(name, pass, detail = '') {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? `  — ${detail}` : ''}`);
}

function openSession(env = {}) {
  const child = spawn(process.execPath, [entry], {
    cwd: serverRoot,
    stdio: ['pipe', 'pipe', 'pipe'],
    env: { ...process.env, PRO_LICENSE_KEY: '', ...env }
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

  const session = {
    stderr,
    request(method, params = {}, timeoutMs = 8000) {
      const id = nextId++;
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          pending.delete(id);
          reject(new Error(`${method} timed out after ${timeoutMs}ms`));
        }, timeoutMs);
        pending.set(id, msg => {
          clearTimeout(timer);
          resolve(msg);
        });
        child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n');
      });
    },
    notify(method, params = {}) {
      child.stdin.write(JSON.stringify({ jsonrpc: '2.0', method, params }) + '\n');
    },
    close() {
      child.stdin.end();
      child.kill();
    }
  };
  return session;
}

const MODERN_META = {
  'io.modelcontextprotocol/protocolVersion': '2026-07-28',
  'io.modelcontextprotocol/clientInfo': { name: 'fastr-verify', version: '0.0.0' },
  'io.modelcontextprotocol/clientCapabilities': {}
};

const CORE = ['ls_search_docs', 'ls_get_schema', 'fc_search_hooks', 'fc_get_db_schema', 'suite_get_pro_info'];
const PRO = ['ls_verify_webhook', 'ls_validate_license', 'fc_generate_payment_gateway_boilerplate'];

// ---------------------------------------------------------------- core tier
{
  const s = openSession();
  try {
    const init = await s.request('initialize', {
      protocolVersion: '2025-11-25',
      capabilities: {},
      clientInfo: { name: 'fastr-verify', version: '0.0.0' }
    });
    check('legacy: initialize', Boolean(init.result?.serverInfo), `${init.result?.serverInfo?.name}@${init.result?.serverInfo?.version}`);
    s.notify('notifications/initialized');

    const tools = await s.request('tools/list');
    const names = (tools.result?.tools ?? []).map(t => t.name);
    check('core: core tools present', CORE.every(t => names.includes(t)), `${names.length} tools`);
    check('core: pro tools withheld', !PRO.some(t => names.includes(t)), PRO.filter(t => names.includes(t)).join(', ') || 'none leaked');

    const denied = await s.request('tools/call', { name: 'ls_verify_webhook', arguments: { rawBody: '{}', signatureHeader: 'x', signingSecret: 'y' } });
    check('core: pro tool call rejected', Boolean(denied.error) || denied.result?.isError === true, denied.error?.message ?? 'isError');

    const skills = await s.request('skills/list');
    const skillList = skills.result?.skills ?? [];
    check('core: skills/list', skillList.length === 2, `${skillList.length} skills`);

    const search = await s.request('tools/call', { name: 'ls_search_docs', arguments: { query: 'signature', category: 'webhooks' } });
    check('core: ls_search_docs', (search.result?.content?.[0]?.text ?? '').length > 100);

    const hooks = await s.request('tools/call', { name: 'fc_search_hooks', arguments: { query: 'order' } });
    check('core: fc_search_hooks', (hooks.result?.content?.[0]?.text ?? '').length > 100);

    const schema = await s.request('tools/call', { name: 'fc_get_db_schema', arguments: { table: 'orders' } });
    check('core: fc_get_db_schema', !schema.result?.isError && (schema.result?.content?.[0]?.text ?? '').length > 50);

    const info = await s.request('tools/call', { name: 'suite_get_pro_info', arguments: {} });
    const infoText = info.result?.content?.[0]?.text ?? '';
    check('core: pro info tool', infoText.includes('"tier": "core"'), `${infoText.length} chars`);
  } catch (err) {
    check('core session', false, err.message);
  } finally {
    s.close();
  }
}

// ----------------------------------------------------------------- pro tier
{
  const s = openSession({ PRO_LICENSE_KEY: 'verify-probe-key-1234567890' });
  try {
    await s.request('initialize', { protocolVersion: '2025-11-25', capabilities: {}, clientInfo: { name: 'fastr-verify', version: '0.0.0' } });
    s.notify('notifications/initialized');

    const tools = await s.request('tools/list');
    const names = (tools.result?.tools ?? []).map(t => t.name);
    check('pro: all tools registered', PRO.every(t => names.includes(t)), `${names.length} tools`);

    const secret = 'whsec_test_secret';
    const body = JSON.stringify({ meta: { event_name: 'order_created' } });
    const signature = crypto.createHmac('sha256', secret).update(body, 'utf8').digest('hex');

    const verify = await s.request('tools/call', {
      name: 'ls_verify_webhook',
      arguments: { rawBody: body, signatureHeader: signature, signingSecret: secret }
    });
    const verifyText = verify.result?.content?.[0]?.text ?? '';
    check('pro: valid HMAC accepted', verifyText.includes('"valid": true'));

    const tampered = await s.request('tools/call', {
      name: 'ls_verify_webhook',
      arguments: { rawBody: body + ' ', signatureHeader: signature, signingSecret: secret }
    });
    check('pro: tampered body rejected', (tampered.result?.content?.[0]?.text ?? '').includes('"valid": false'));

    const boiler = await s.request('tools/call', {
      name: 'fc_generate_payment_gateway_boilerplate',
      arguments: { gatewaySlug: 'paddle_billing', gatewayTitle: 'Paddle Billing', supportsSubscriptions: true }
    });
    const php = boiler.result?.content?.[0]?.text ?? '';
    check('pro: gateway boilerplate', php.includes('class PaddleBillingGateway') && php.includes("'subscriptions'"));
  } catch (err) {
    check('pro session', false, err.message);
  } finally {
    s.close();
  }
}

// ------------------------------------------------------- modern era (2026-07-28)
{
  const s = openSession();
  try {
    const discover = await s.request('server/discover', { _meta: MODERN_META });
    const versions = discover.result?.supportedVersions ?? [];
    check('modern: server/discover', versions.length > 0, versions.join(', '));

    const tools = await s.request('tools/list', { _meta: MODERN_META });
    const names = (tools.result?.tools ?? []).map(t => t.name);
    check('modern: stateless tools/list', CORE.every(t => names.includes(t)), `${names.length} tools`);
  } catch (err) {
    check('modern session', false, err.message);
  } finally {
    s.close();
  }
}

const failed = results.filter(r => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length === 0 ? 0 : 1);
