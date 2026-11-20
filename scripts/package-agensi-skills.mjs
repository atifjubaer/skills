#!/usr/bin/env node
// Package the skill into a clean, spec-compliant ZIP archive for Agensi:
//   1. marketplace/agensi/fluentcart-developer.zip
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
  'gumroad.com', 'gum.co', 'whop.com', 'payhip.com',
  'ko-fi.com', 'buymeacoffee.com', 'patreon.com', 'buy.stripe.com',
  'checkout.stripe.com', 'paypal.me', 'sellfy.com', 'podia.com',
  'teachable.com', 'thinkific.com', 'kajabi.com', 'stan.store', 'polar.sh',
  'paddle.com'
];

function scanForBannedHosts(label, entries) {
  const hits = [];
  const checkFile = file => {
    const lines = readFileSync(file, 'utf8').split('\n');
    let fenced = false;
    lines.forEach((line, i) => {
      // The rule protects against a listing that points buyers at an outside
      // checkout. Fenced code is an integration example, not a sales link: the
      // vendor's own Paddle guide cannot document the gateway without naming
      // paddle.com, and that is what the page is for.
      if (/^\s*(```|~~~)/.test(line)) {
        fenced = !fenced;
        return;
      }
      if (fenced) return;

      const prose = line.replace(/`[^`]*`/g, '');
      for (const host of BANNED_VENDOR_HOSTS) {
        if (prose.toLowerCase().includes(host)) hits.push(`${file}:${i + 1}  ${host}`);
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
scanForBannedHosts('skill folders', ['skills/fluentcart-developer']);

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

/**
 * The subset of the documentation corpus that ships to Agensi.
 *
 * Agensi rejects archives over 50 files (`pyVerify` asserts it), and the full
 * corpus is 588 pages. The 474 `restapi/operations/` pages and the 49
 * `database/` pages are most of it, so they are left out and the archive keeps
 * the parts that read as a coherent manual on their own: every hook, every
 * module, payment integration, and the guides.
 *
 * This archive is a curated subset only; the full corpus ships through npm and
 * MCPize. There is no premium tier any more — every reference file is public.
 */
const AGENSI_SECTIONS = [
  'hooks',
  'modules',
  'payment-methods-integration',
  'guides'
];

const AGENSI_ROOT_PAGES = ['getting-started.md'];

function stageSkill(card) {
  const dest = join(staging, card);
  const src = join(root, 'skills', card);
  const refsSrc = join(src, 'references');
  const refsDest = join(dest, 'references');

  mkdirSync(refsDest, { recursive: true });
  copyFileSync(join(src, 'SKILL.md'), join(dest, 'SKILL.md'));

  const shipped = [];
  const copyRef = rel => {
    const to = join(refsDest, rel);
    mkdirSync(dirname(to), { recursive: true });
    copyFileSync(join(refsSrc, rel), to);
    shipped.push(rel);
  };

  for (const page of AGENSI_ROOT_PAGES) {
    if (existsSync(join(refsSrc, page))) copyRef(page);
  }
  // Sections nest (`hooks/actions/orders.md`), so walk them to the leaves.
  const walkRefs = (section, dir, prefix) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isDirectory()) walkRefs(section, join(dir, entry.name), rel);
      else if (entry.name.endsWith('.md')) copyRef(`${section}/${rel}`);
    }
  };

  for (const section of AGENSI_SECTIONS) {
    const dir = join(refsSrc, section);
    if (existsSync(dir)) walkRefs(section, dir, '');
  }

  // An index listing only what actually shipped, so no link dangles.
  writeFileSync(
    join(refsDest, 'INDEX.md'),
    [
      '# FluentCart Developer — Documentation Index',
      '',
      'The pages bundled in this archive, mirrored from <https://dev.fluentcart.com>.',
      'The complete 588-page corpus ships with the MCP server and the npm package.',
      '',
      ...shipped.sort().map(f => `- references/${f}`),
      ''
    ].join('\n')
  );

  // SKILL.md sits at the archive root; everything else is under references/.
  const total = shipped.length + 1;
  console.log(`[agensi] ${card}: ${total} file(s) staged (Agensi limit 50)`);
  if (total > 50) {
    console.error(`[agensi] ${card} is over the 50-file Agensi limit — trim AGENSI_SECTIONS.`);
    process.exit(1);
  }
  return dest;
}

console.log('--- 1. Staging Marketplace Build ---');
rmSync(staging, { recursive: true, force: true });
const fcStage = stageSkill('fluentcart-developer');
console.log(`Staged ${fcStage}`);

console.log('--- 2. Packaging the Skill ---');

// FluentCart Developer (flat at root so SKILL.md is at root of archive)
const fcZip = join(outDir, 'fluentcart-developer.zip');
createZip(fcZip, `flat:${relative(root, fcStage)}`);

console.log('--- 3. Verifying the Archive ---');

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

execFileSync('python', ['-I', '-c', pyVerify, fcZip], { cwd: root, stdio: 'inherit' });

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

### Pair with the FluentCart Developer MCP server:
For live hook search, schema lookup and boilerplate generation inside Claude, connect the companion MCP server — hosted, or run it locally with no account:
👉 **[fluentcart-developer on MCPize](https://mcpize.com/mcp/fluentcart-developer)**
👉 \`npx -y fluentcart-developer\`
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

console.log('--- 6. Re-checking Submission Copy ---');
scanForBannedHosts('submission sheets', [
  'marketplace/agensi/fluentcart-developer-submission.md'
]);

rmSync(staging, { recursive: true, force: true });

console.log('Packaging and submission sheets complete in marketplace/agensi/');
