#!/usr/bin/env node
// Package the skills into clean, spec-compliant ZIP archives for Agensi:
//   1. marketplace/agensi/fluentcart-developer.zip
//   2. marketplace/agensi/lemonsqueezy-developer.zip
//   3. marketplace/agensi/fastr-ecommerce-suite.zip (bundled pack)
//
// Also generates ready-to-paste submission listings in marketplace/agensi/
// with the exact fields required by the Agensi creator dashboard:
//   - Skill Name (<= 60 chars)
//   - Summary (<= 300 chars)
//   - Full Description (Markdown)
//   - The Request (Demo prompt)
//   - The Result (Demo output, >700 chars)
//   - Compatibility notes, tags, permissions

import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'marketplace', 'agensi');
mkdirSync(outDir, { recursive: true });

// Python script to create deterministic, clean zip files
const pyZipBuilder = `
import zipfile, os, sys

target_zip = sys.argv[1]
spec = sys.argv[2]  # format: "root_mode:dir1;root_mode:dir2" or "flat:dir"

with zipfile.ZipFile(target_zip, 'w', zipfile.ZIP_DEFLATED) as z:
    for entry in spec.split('|'):
        mode, folder = entry.split(':')
        folder_abs = os.path.abspath(folder)
        base_name = os.path.basename(folder_abs)
        for root_dir, dirs, files in os.walk(folder_abs):
            # prune hidden dirs
            dirs[:] = [d for d in dirs if not d.startswith('.')]
            for f in files:
                if f.startswith('.') or f.endswith('.tmp') or f.endswith('.log'):
                    continue
                file_path = os.path.join(root_dir, f)
                rel = os.path.relpath(file_path, folder_abs)
                if mode == 'flat':
                    arcname = rel
                else:
                    arcname = os.path.join(base_name, rel)
                # Normalize slashes for zip spec
                arcname = arcname.replace('\\\\', '/')
                z.write(file_path, arcname)

print(f"Created {target_zip}")
`;

function createZip(outputPath, spec) {
  execFileSync('python', ['-I', '-c', pyZipBuilder, outputPath, spec], {
    cwd: root,
    stdio: 'inherit'
  });
}

// Agensi rejects any listing whose files link to an outside checkout vendor
// (anti-disintermediation filter). Scan the source folders first so a violating
// ZIP is never built, instead of being rejected after upload.
const BANNED_VENDOR_HOSTS = [
  'gumroad.com', 'gum.co', 'whop.com', 'lemonsqueezy.com', 'payhip.com',
  'ko-fi.com', 'buymeacoffee.com', 'patreon.com', 'buy.stripe.com',
  'checkout.stripe.com', 'paypal.me', 'sellfy.com', 'podia.com',
  'teachable.com', 'thinkific.com', 'kajabi.com', 'stan.store', 'polar.sh',
  'paddle.com'
];

function scanForBannedHosts(label, entries) {
  const hits = [];
  const checkFile = file => {
    const lines = readFileSync(file, 'utf8').split('\n');
    lines.forEach((line, i) => {
      for (const host of BANNED_VENDOR_HOSTS) {
        if (line.toLowerCase().includes(host)) hits.push(`${file}:${i + 1}  ${host}`);
      }
    });
  };
  const walk = dir => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith('.')) continue;
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (/\.(md|php|js|mjs|ts|json|txt)$/i.test(entry.name)) checkFile(full);
    }
  };
  for (const entry of entries) {
    const full = join(root, entry);
    if (existsSync(full) && statSync(full).isDirectory()) walk(full);
    else if (existsSync(full)) checkFile(full);
  }
  if (hits.length) {
    console.error(`[agensi] Outside-checkout vendor hosts found in ${label} — resolve before packaging:`);
    for (const hit of hits) console.error(`  ${hit}`);
    process.exit(1);
  }
  console.log(`[agensi] Clean: no outside-checkout vendor hosts in ${label}.`);
}

console.log('--- 0. Checking Vendor Links ---');
scanForBannedHosts('skill folders', ['skills/fluentcart-developer', 'skills/lemonsqueezy-developer']);

// Agensi flags any archive holding more than 50 files, so the marketplace build
// is trimmed without touching the repo: runnable `examples/` stay in the repo and
// the npm package, and each hook group ships as one consolidated reference.
const staging = join(outDir, '.staging');

function copyFolder(src, dest, skip) {
  mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src, { withFileTypes: true })) {
    if (skip.includes(entry.name)) continue;
    const from = join(src, entry.name);
    const to = join(dest, entry.name);
    if (entry.isDirectory()) copyFolder(from, to, []);
    else copyFileSync(from, to);
  }
}

function mergeHookFiles(refsDir, pattern, output, title) {
  const files = readdirSync(refsDir)
    .filter(f => f.startsWith(pattern) && f.endsWith('.md'))
    .sort();
  if (files.length < 2) return;
  const body = files
    .map(f => readFileSync(join(refsDir, f), 'utf8').trim())
    .join('\n\n---\n\n');
  writeFileSync(join(refsDir, output), `# ${title}\n\n${body}\n`);
  for (const f of files) rmSync(join(refsDir, f));
}

function rewriteSkillMd(file, sections) {
  const lines = readFileSync(file, 'utf8').split('\n');
  const out = [];
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i].trim();
    const section = sections.find(s => line === s.heading);
    if (!section) {
      out.push(lines[i]);
      continue;
    }
    if (section.headingReplacement !== null) out.push(section.headingReplacement ?? lines[i]);
    i += 1;
    while (i < lines.length && (lines[i].trim() === '' || lines[i].trim().startsWith('- ['))) i += 1;
    i -= 1;
    if (section.replacement) out.push('', section.replacement, '');
  }
  writeFileSync(file, out.join('\n'));
}

function stageSkill(card) {
  const dest = join(staging, card);
  copyFolder(join(root, 'skills', card), dest, ['examples']);
  const refs = join(dest, 'references');
  mergeHookFiles(refs, 'action-hooks-', 'action-hooks-reference.md', 'FluentCart Action Hooks — Complete Reference');
  mergeHookFiles(refs, 'filter-hooks-', 'filter-hooks-reference.md', 'FluentCart Filter Hooks — Complete Reference');
  rewriteSkillMd(join(dest, 'SKILL.md'), [
    {
      heading: '#### Action Hooks (8 Modular Files)',
      headingReplacement: '#### Action Hooks',
      replacement:
        '- [action-hooks-reference.md](references/action-hooks-reference.md) — Complete action hook reference: orders, subscriptions, licenses, cart & checkout, customers, products & coupons, payments & integrations, admin templates.'
    },
    {
      heading: '#### Filter Hooks (6 Modular Files)',
      headingReplacement: '#### Filter Hooks',
      replacement:
        '- [filter-hooks-reference.md](references/filter-hooks-reference.md) — Complete filter hook reference: settings & configuration, orders & payments, products & pricing, cart & checkout, customers & subscriptions, integrations & advanced.'
    },
    { heading: '#### Runnable Code Examples & Project Boilerplates (`examples/`)', headingReplacement: null, replacement: null }
  ]);
  return dest;
}

console.log('--- 1. Staging Marketplace Build ---');
rmSync(staging, { recursive: true, force: true });
const fcStage = stageSkill('fluentcart-developer');
const lsStage = stageSkill('lemonsqueezy-developer');
console.log(`Staged ${fcStage} and ${lsStage}`);

console.log('--- 2. Packaging Individual Skills ---');

// 1. FluentCart Developer (flat at root so SKILL.md is at root of archive)
const fcZip = join(outDir, 'fluentcart-developer.zip');
createZip(fcZip, `flat:${relative(root, fcStage)}`);

// 2. Lemon Squeezy Developer (flat at root)
const lsZip = join(outDir, 'lemonsqueezy-developer.zip');
createZip(lsZip, `flat:${relative(root, lsStage)}`);

console.log('--- 3. Packaging Combined Multi-Skill Suite ---');

// 3. Fastr E-Commerce Suite (nested by skill name so both skills coexist)
const suiteZip = join(outDir, 'fastr-ecommerce-suite.zip');
createZip(suiteZip, `nested:${relative(root, fcStage)}|nested:${relative(root, lsStage)}`);

console.log('--- 4. Verifying Archives ---');

const pyVerify = `
import zipfile, sys

zip_path = sys.argv[1]
with zipfile.ZipFile(zip_path, 'r') as z:
    names = z.namelist()
    skills = [n for n in names if n.lower().endswith('skill.md')]
    print(f"{zip_path}:")
    print(f"  Total files : {len(names)}")
    print(f"  SKILL.md    : {skills}")
    assert len(skills) >= 1, "Missing SKILL.md in archive"
    assert len(names) <= 50, f"Agensi flags archives with more than 50 files (found {len(names)})"
`;

for (const z of [fcZip, lsZip, suiteZip]) {
  execFileSync('python', ['-I', '-c', pyVerify, z], { cwd: root, stdio: 'inherit' });
}

console.log('--- 5. Writing Submission Metadata Sheets ---');

// FluentCart Submission Sheet
const fcSubmission = `# Agensi Skill Submission: FluentCart Developer

## Step 1: Skill ZIP Upload
- **File:** \`marketplace/agensi/fluentcart-developer.zip\`
- **Logo:** \`marketplace/assets/fluentcart-developer-logo.png\`

## Step 2: Skill Details
- **Skill Name:** FluentCart Developer Pro Agent
- **Summary:** Complete developer reference for FluentCart WordPress e-commerce: hooks, database schemas, REST APIs, custom payment gateways, and shipping integrations.
- **Category:** Developer Tools / WordPress
- **Tags:** \`fluentcart\`, \`wordpress\`, \`ecommerce\`, \`payments\`, \`php\`

### Full Description:
\`\`\`markdown
# FluentCart Developer Pro Agent

The definitive developer knowledge base and architecture manual for **FluentCart**, the high-performance WordPress e-commerce platform.

### What's Included:
- **Hook Catalog:** Comprehensive signatures and argument definitions for FluentCart action & filter hooks (order lifecycle, checkout, subscriptions, licenses).
- **Database Schema Models:** Table schemas, foreign keys, and indexes for \`wp_fct_*\` tables.
- **Custom Payment Gateways:** Working boilerplate, webhook listeners, and transaction reconciliation patterns.
- **Shipping & Surcharges:** Dynamic shipping carriers, custom fee surcharges, and ghost product handling.
- **REST API Reference:** Admin and customer profile endpoints, schema payloads, and authentication.

### Pair with Fastr MCP Suite:
For live payment gateway code generation and database querying inside Claude, install our companion MCP server on MCPize:
👉 **[Fastr MCP Suite on MCPize](https://mcpize.com/mcp/fastr-mcp-suite)**
\`\`\`

## Step 3: See it in Action (Demo)

### The Request (what the buyer types):
\`\`\`text
I need to add a custom payment gateway called "QuickPay" to FluentCart in WordPress.
Can you provide the complete boilerplate class implementing the necessary FluentCart gateway hooks,
settings fields, and redirect flow?
\`\`\`

### The Result (what your agent delivers):
\`\`\`text
Here is the production-ready custom payment gateway integration for FluentCart implementing the \`fluent_cart/payment_methods\` filter and gateway abstract methods.

### 1. Register Gateway Hook
\`\`\`php
<?php
defined('ABSPATH') || exit;

add_filter('fluent_cart/payment_methods', function ($methods) {
    $methods['quickpay'] = [
        'title'       => __('QuickPay', 'fluent-cart-quickpay'),
        'description' => __('Pay securely via QuickPay gateway.', 'fluent-cart-quickpay'),
        'class'       => QuickPayGateway::class,
        'supports'    => ['products', 'refunds']
    ];
    return $methods;
});
\`\`\`

### 2. Gateway Implementation Class
\`\`\`php
use FluentCart\\App\\Services\\Payments\\BasePaymentMethod;

class QuickPayGateway extends BasePaymentMethod
{
    public function handlePayment($order)
    {
        $orderId = $order->id;
        $amount  = $order->total_amount;
        $apiKey  = $this->getSetting('api_key');

        // Create remote session and redirect customer
        $redirectUrl = "https://quickpay.example.com/checkout?order={$orderId}&amount={$amount}";

        return [
            'status'       => 'success',
            'redirect_url' => $redirectUrl,
            'message'      => __('Redirecting to payment gateway...', 'fluent-cart-quickpay')
        ];
    }
}
\`\`\`
\`\`\`

## Step 4: Compatibility
- **Universal SKILL.md Standard:** Compatible with Claude Code, Cursor, Codex CLI, OpenClaw, Gemini CLI, VS Code Copilot.
- **Compatibility Note:** No external dependencies required. Works offline with any markdown-capable agent.

## Step 5: Pricing
- **Pricing Model:** Free ($0). The companion MCP server and all of its tools are free and MIT-licensed too.
`;

writeFileSync(join(outDir, 'fluentcart-developer-submission.md'), fcSubmission);

// Lemon Squeezy Submission Sheet
const lsSubmission = `# Agensi Skill Submission: Lemon Squeezy Developer

## Step 1: Skill ZIP Upload
- **File:** \`marketplace/agensi/lemonsqueezy-developer.zip\`
- **Logo:** \`marketplace/assets/lemonsqueezy-developer-logo.png\`

## Step 2: Skill Details
- **Skill Name:** Lemon Squeezy Developer Agent
- **Summary:** Complete developer reference for Lemon Squeezy e-commerce: checkout overlays, HMAC-SHA256 webhooks, subscription lifecycles, and software license keys.
- **Category:** Developer Tools / E-Commerce
- **Tags:** \`lemonsqueezy\`, \`payments\`, \`subscriptions\`, \`billing\`, \`licensing\`, \`ecommerce\`

### Full Description:
\`\`\`markdown
# Lemon Squeezy Developer Agent

Complete technical reference, architectural manual, and guidance system for integrating **Lemon Squeezy** payments, subscriptions, digital downloads, software licenses, and webhooks into Next.js, Node.js, Laravel, Python, WordPress, or any backend stack.

### What's Included:
- **API Reference:** Comprehensive documentation for Lemon Squeezy JSON:API endpoints (Checkouts, Orders, Subscriptions, License Keys, Variants).
- **HMAC-SHA256 Webhook Security:** Timing-safe signature verification algorithms in Node.js, Python, and PHP to prevent forgery attacks.
- **Subscription Lifecycle Management:** Status transitions (\`on_trial\`, \`active\`, \`paused\`, \`past_due\`, \`unpaid\`, \`cancelled\`, \`expired\`) and billing webhooks.
- **Software License Engine:** License activation, site verification, deactivation, and seat limits.
- **Lemon.js Checkout Overlays:** Embedded modal checkout implementation and event listener callbacks.

### Pair with Fastr MCP Suite:
For live signature verification tools and remote license validation endpoints, connect our companion MCP server on MCPize:
👉 **[Fastr MCP Suite on MCPize](https://mcpize.com/mcp/fastr-mcp-suite)**
\`\`\`

## Step 3: See it in Action (Demo)

### The Request (what the buyer types):
\`\`\`text
How do I securely verify a Lemon Squeezy webhook in Node.js using crypto.timingSafeEqual,
and extract the subscription ID from a subscription_payment_success event?
\`\`\`

### The Result (what your agent delivers):
\`\`\`text
Here is the production-grade webhook verification handler for Lemon Squeezy in Node.js.
It enforces HMAC-SHA256 verification using raw binary buffers to prevent timing attacks.

\`\`\`typescript
import crypto from 'node:crypto';

export function verifyLemonSqueezyWebhook(
  rawBody: Buffer,
  signatureHeader: string | null,
  secret: string
): boolean {
  if (!signatureHeader || !secret) return false;

  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(rawBody);
  const digest = hmac.digest('hex');

  const digestBuffer = Buffer.from(digest, 'utf8');
  const signatureBuffer = Buffer.from(signatureHeader, 'utf8');

  if (digestBuffer.length !== signatureBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(digestBuffer, signatureBuffer);
}

// In your Express / Next.js API route:
export async function handleWebhook(req, res) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!;
  const signature = req.headers['x-signature'];
  const rawBody = req.rawBody; // Ensure body-parser raw buffer is preserved

  if (!verifyLemonSqueezyWebhook(rawBody, signature, secret)) {
    return res.status(401).json({ error: 'Invalid HMAC signature' });
  }

  const payload = JSON.parse(rawBody.toString('utf8'));
  const eventName = payload.meta.event_name;

  if (eventName === 'subscription_payment_success') {
    const subscriptionId = payload.data.id;
    const customerId = payload.data.attributes.customer_id;
    const renewsAt = payload.data.attributes.renews_at;
    console.log(\`Subscription \${subscriptionId} renewed for customer \${customerId} until \${renewsAt}\`);
  }

  return res.status(200).json({ received: true });
}
\`\`\`
\`\`\`

## Step 4: Compatibility
- **Universal SKILL.md Standard:** Compatible with Claude Code, Cursor, Codex CLI, OpenClaw, Gemini CLI, VS Code Copilot.
- **Compatibility Note:** Works offline with any markdown-capable agent.

## Step 5: Pricing
- **Pricing Model:** Free ($0). The companion MCP server and all of its tools are free and MIT-licensed too.
`;

writeFileSync(join(outDir, 'lemonsqueezy-developer-submission.md'), lsSubmission);

console.log('--- 6. Re-checking Submission Copy ---');
scanForBannedHosts('submission sheets', [
  'marketplace/agensi/fluentcart-developer-submission.md',
  'marketplace/agensi/lemonsqueezy-developer-submission.md',
  'marketplace/agensi/fastr-ecommerce-suite-submission.md'
]);

rmSync(staging, { recursive: true, force: true });

console.log('Packaging and submission sheets complete in marketplace/agensi/');
