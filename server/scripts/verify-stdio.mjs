// End-to-end stdio protocol probe. Boots the built server exactly the way an
// MCP client does and asserts: handshake, the complete free toolset, skills
// catalog, tool calls, and the 2026-07-28 (modern era) discovery path.
//
// The suite is free, so there is no tier matrix to probe. What replaces it is
// the opposite assertion: an anonymous session must see every tool, and the
// retired PRO_* variables must be inert rather than fatal.
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

function openSession(env = {}) {
  const child = spawn(process.execPath, [entry], {
    cwd: serverRoot,
    stdio: ['pipe', 'pipe', 'pipe'],
    env: { ...process.env, PRO_LICENSE_KEY: '', PRO_CARDS: '', ...env }
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

/** Every tool the suite ships. A free session must see all of them. */
const TOOLS = [
  'ls_search_docs',
  'ls_get_schema',
  'ls_get_reference',
  'ls_verify_webhook',
  'ls_validate_license',
  'fc_search_hooks',
  'fc_get_db_schema',
  'fc_get_reference',
  'fc_generate_payment_gateway_boilerplate',
  'fc_generate_licensing_boilerplate',
  'fc_generate_customer_endpoint_boilerplate',
  'suite_get_info'
];

// -------------------------------------------------------------- free session
{
  const s = openSession();
  try {
    const init = await s.request('initialize', {
      protocolVersion: '2025-11-25',
      capabilities: {},
      clientInfo: { name: 'fastr-verify', version: '0.0.0' }
    });
    check('free: initialize', Boolean(init.result?.serverInfo), `${init.result?.serverInfo?.name}@${init.result?.serverInfo?.version}`);
    // src/version.ts is a constant because the manifest is not always next to
    // dist/ at runtime; this check is what stops the two drifting apart.
    check(
      'free: advertise the package version',
      init.result?.serverInfo?.version === pkg.version,
      `server ${init.result?.serverInfo?.version} vs package ${pkg.version}`
    );
    s.notify('notifications/initialized');

    const tools = await s.request('tools/list');
    const names = (tools.result?.tools ?? []).map(t => t.name);
    const missing = TOOLS.filter(t => !names.includes(t));
    check('free: all 12 tools registered', missing.length === 0, missing.join(', ') || `${names.length} tools`);
    check('free: no duplicate registration', names.length === TOOLS.length, `${names.length} of ${TOOLS.length}`);

    const skills = await s.request('skills/list');
    const skillList = skills.result?.skills ?? [];
    // Names, not a count: skills are discovered from `skills/` at build time, so
    // shipping one more must not fail the probe.
    const skillNames = skillList.map(s => s.frontmatter?.name ?? '');
    const missingSkills = ['fluentcart-developer', 'lemonsqueezy-developer'].filter(n => !skillNames.includes(n));
    check('free: skills/list', missingSkills.length === 0, missingSkills.join(', ') || `${skillList.length} skills: ${skillNames.join(', ')}`);

    const search = await s.request('tools/call', { name: 'ls_search_docs', arguments: { query: 'signature', category: 'webhooks' } });
    check('free: ls_search_docs', (search.result?.content?.[0]?.text ?? '').length > 100);

    const hooks = await s.request('tools/call', { name: 'fc_search_hooks', arguments: { query: 'order' } });
    check('free: fc_search_hooks', (hooks.result?.content?.[0]?.text ?? '').length > 100);

    const schema = await s.request('tools/call', { name: 'fc_get_db_schema', arguments: { table: 'orders' } });
    check('free: fc_get_db_schema', !schema.result?.isError && (schema.result?.content?.[0]?.text ?? '').length > 50);

    // Both reference readers must reach a file no other tool exposes — the
    // point of adding them was that ~30 reference files were unreachable.
    const fcRefs = await s.request('tools/call', { name: 'fc_get_reference', arguments: {} });
    const fcRefsText = fcRefs.result?.content?.[0]?.text ?? '';
    check(
      'free: fc_get_reference lists files',
      fcRefsText.includes('rest-api-subscriptions.md') && fcRefsText.includes('models-complete-index.md'),
      `${fcRefsText.split('\n').length} lines`
    );

    const fcSection = await s.request('tools/call', {
      name: 'fc_get_reference',
      arguments: { file: 'rest-api-subscriptions.md', section: 'Void Renewal Invoice' }
    });
    const fcSectionText = fcSection.result?.content?.[0]?.text ?? '';
    check(
      'free: fc_get_reference section',
      fcSectionText.startsWith('### Void Renewal Invoice'),
      `${fcSectionText.length} chars`
    );

    const traversal = await s.request('tools/call', {
      name: 'fc_get_reference',
      arguments: { file: '../paths.ts' }
    });
    check('free: fc_get_reference rejects traversal', traversal.result?.isError === true);

    const lsRefs = await s.request('tools/call', {
      name: 'ls_get_reference',
      arguments: { file: 'webhooks-and-security.md', section: 'Webhook Event Catalog' }
    });
    const lsRefsText = lsRefs.result?.content?.[0]?.text ?? '';
    check(
      'free: ls_get_reference section',
      lsRefsText.includes('subscription_payment_refunded'),
      `${lsRefsText.length} chars`
    );

    const info = await s.request('tools/call', { name: 'suite_get_info', arguments: {} });
    const parsed = JSON.parse(info.result?.content?.[0]?.text ?? '{}');
    check(
      'free: suite_get_info reports free',
      parsed.session?.tier === 'free' && parsed.price === 'free' && parsed.licence === 'MIT',
      `${parsed.price}/${parsed.licence}`
    );
    check('free: suite_get_info counts every tool', parsed.tools?.total === TOOLS.length, `${parsed.tools?.total} tools`);

    const scoped = await s.request('tools/call', { name: 'suite_get_info', arguments: { card: 'fluentcart' } });
    const scopedParsed = JSON.parse(scoped.result?.content?.[0]?.text ?? '{}');
    const fcOnly = scopedParsed.tools?.byCard?.[0]?.tools ?? [];
    check(
      'free: suite_get_info card filter',
      scopedParsed.tools?.byCard?.length === 1 &&
        fcOnly.includes('fc_generate_payment_gateway_boilerplate') &&
        !fcOnly.some(t => t.startsWith('ls_')),
      fcOnly.join(', ')
    );

    // The two tools that used to sit behind a key are now callable anonymously.
    const secret = 'whsec_test_secret';
    const body = JSON.stringify({ meta: { event_name: 'order_created' } });
    const signature = crypto.createHmac('sha256', secret).update(body, 'utf8').digest('hex');

    const verify = await s.request('tools/call', {
      name: 'ls_verify_webhook',
      arguments: { rawBody: body, signatureHeader: signature, signingSecret: secret }
    });
    check('free: valid HMAC accepted', (verify.result?.content?.[0]?.text ?? '').includes('"valid": true'));

    const tampered = await s.request('tools/call', {
      name: 'ls_verify_webhook',
      arguments: { rawBody: body + ' ', signatureHeader: signature, signingSecret: secret }
    });
    check('free: tampered body rejected', (tampered.result?.content?.[0]?.text ?? '').includes('"valid": false'));

    const boiler = await s.request('tools/call', {
      name: 'fc_generate_payment_gateway_boilerplate',
      arguments: { gatewaySlug: 'paddle_billing', gatewayTitle: 'Paddle Billing', supportsSubscriptions: true }
    });
    const php = boiler.result?.content?.[0]?.text ?? '';
    check('free: gateway boilerplate', php.includes('class PaddleBillingGateway') && php.includes("'subscriptions'"));

    const licBoiler = await s.request('tools/call', {
      name: 'fc_generate_licensing_boilerplate',
      arguments: {
        pluginNamespace: 'Acme\\ProPlugin',
        pluginTitle: 'Acme Pro Plugin',
        itemId: 42,
        apiUrl: 'https://store.example.com/'
      }
    });
    const licPhp = licBoiler.result?.content?.[0]?.text ?? '';
    check(
      'free: licensing boilerplate',
      licPhp.includes('FluentLicensing') && licPhp.includes('LicenseSettings') && licPhp.includes('item_id')
    );

    const endpointBoiler = await s.request('tools/call', {
      name: 'fc_generate_customer_endpoint_boilerplate',
      arguments: {
        endpointSlug: 'acme-wallet',
        tabTitle: 'My Wallet',
        subRoutes: ['history', 'topup']
      }
    });
    const endpointPhp = endpointBoiler.result?.content?.[0]?.text ?? '';
    check(
      'free: customer endpoint boilerplate',
      endpointPhp.includes('addCustomerDashboardEndpoint') &&
        endpointPhp.includes('CustomerResource::getCurrentCustomer()') &&
        endpointPhp.includes('acme-wallet')
    );
  } catch (err) {
    check('free session', false, err.message);
  } finally {
    s.close();
  }
}

// ------------------------------------------------- retired env vars are inert
// Clients installed while the suite was sold still carry PRO_LICENSE_KEY and
// PRO_CARDS in their MCP config. Those must be silently ignored: a stale key is
// not a licence error any more, and a junk PRO_CARDS must not narrow anything.
{
  const s = openSession({ PRO_LICENSE_KEY: 'retired-probe-key', PRO_CARDS: 'notacard' });
  try {
    await s.request('initialize', { protocolVersion: '2025-11-25', capabilities: {}, clientInfo: { name: 'fastr-verify', version: '0.0.0' } });
    s.notify('notifications/initialized');

    const tools = await s.request('tools/list');
    const names = (tools.result?.tools ?? []).map(t => t.name);
    const missing = TOOLS.filter(t => !names.includes(t));
    check('retired env: all tools still registered', missing.length === 0, missing.join(', ') || `${names.length} tools`);

    const info = await s.request('tools/call', { name: 'suite_get_info', arguments: {} });
    const parsed = JSON.parse(info.result?.content?.[0]?.text ?? '{}');
    check('retired env: still reported free', parsed.session?.tier === 'free' && parsed.price === 'free', parsed.session?.transport);
    check('retired env: no crash on stderr', s.stderr.join('').trim() === '', s.stderr.join('').trim().slice(0, 120) || 'clean');
  } catch (err) {
    check('retired env session', false, err.message);
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
    const missing = TOOLS.filter(t => !names.includes(t));
    check('modern: stateless tools/list', missing.length === 0, missing.join(', ') || `${names.length} tools`);
  } catch (err) {
    check('modern session', false, err.message);
  } finally {
    s.close();
  }
}

const failed = results.filter(r => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length === 0 ? 0 : 1);
