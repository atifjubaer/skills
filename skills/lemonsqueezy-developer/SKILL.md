---
name: "lemonsqueezy-developer"
description: "Comprehensive developer knowledge base and architectural manual for integrating Lemon Squeezy e-commerce, subscriptions, checkouts, and licensing into any web, WordPress, or mobile stack. Covers JSON:API conventions, checkout sessions, Lemon.js overlays, HMAC-SHA256 webhook security, subscription lifecycles, and software license keys."
summary: "Developer architecture manual and code generator for Lemon Squeezy: Next.js/WordPress billing, checkout overlays, HMAC-SHA256 webhooks, subscriptions, and software licensing."
version: "1.2.0"
license: "MIT"
tags:
  - payments
  - subscriptions
  - lemonsqueezy
  - billing
  - licensing
  - ecommerce
  - nextjs
  - wordpress
keywords:
  - lemonsqueezy
  - payment checkout
  - webhook verification
  - license activation
  - subscription billing
  - lemon.js
use_cases:
  - Integrating Lemon Squeezy checkout overlays and hosted checkouts
  - Securing and handling Lemon Squeezy webhooks with HMAC-SHA256 in Next.js and PHP
  - Validating and managing software license keys for WordPress plugins and desktop apps
  - Managing SaaS recurring subscriptions, customer portals, and dunning lifecycles
---

# Lemon Squeezy Developer Skill

Complete technical reference, architectural manual, and guidance system for integrating **Lemon Squeezy** payments, subscriptions, digital downloads, software licenses, and webhooks into Next.js, Node.js, Laravel, Python, WordPress, or any backend stack.

> **URL placeholders used throughout this document:** `api.example.com` stands in for the API host of your payment provider (Lemon Squeezy serves its REST and Licensing APIs from its `api.` subdomain), `{slug}.example.com` / `my-store.example.com` stand in for your store subdomain, and `app.example.com` stands in for the seller dashboard host. Substitute your real hosts when making requests — every path and payload in the examples is otherwise literal.

---

## 🤖 AI Agent Execution Protocol & Routing Guidelines

When assisting a developer with Lemon Squeezy tasks, follow this step-by-step workflow:

### Step 1: Identify Task Scope & Domain
Determine which area of Lemon Squeezy the user's request touches:
- **Webhooks & Real-time Sync:** Verifying `X-Signature`, HMAC-SHA256 computation, handling `order_created`, `subscription_created`, dunning.
- **Checkouts & Overlays:** Generating dynamic checkout URLs, Lemon.js embedded modals, custom metadata, pre-filled forms.
- **Subscriptions & Billing:** Plan upgrades/downgrades, pauses, unpauses, cancellations, grace periods, customer portal URLs.
- **Software Licensing:** Offline/desktop activation, license validation, deactivation, instance tracking.
- **REST API Specs & Queries:** JSON:API specification, relationships, includes, filtering, pagination, and rate limits.

### Step 2: Read Target Reference File(s)
Do not guess payload structures, header formats, or webhook signing code. Read and cite the dedicated reference files under `references/`:

- [webhooks-and-security.md](references/webhooks-and-security.md) — Raw body HMAC-SHA256 calculation, security traps, event catalog, and JSON:API webhook shapes.
- [checkouts-and-orders.md](references/checkouts-and-orders.md) — Creating checkouts via API, Lemon.js overlay embeds, custom metadata passing, order querying.
- [subscriptions-lifecycle.md](references/subscriptions-lifecycle.md) — Subscription state machine, pausing, cancellations, customer portal URLs, renewal retries.
- [license-keys-and-activation.md](references/license-keys-and-activation.md) — Public licensing endpoints (`/activate`, `/validate`, `/deactivate`), instance management.
- [developer-guide.md](references/developer-guide.md) — Complete high-level developer manual and getting started flow.
- [api-reference.md](references/api-reference.md) — Exhaustive 230KB endpoint reference (Stores, Products, Variants, Prices, Files, Orders, Discounts).
- [go-live-guide.md](references/go-live-guide.md) — Production checklist, test mode vs live mode credentials, tax compliance.

#### Runnable Code Examples & Project Boilerplates (`examples/`)
- [examples/README.md](examples/README.md) — Inventory and developer guide for ready-to-use sample implementations.
- [nextjs-app-router-billing/](examples/nextjs-app-router-billing/) — Complete Next.js 14/15 App Router timing-safe webhook handler and subscription synchronization.
- [wordpress-plugin-lemon-licensing/](examples/wordpress-plugin-lemon-licensing/) — Production WordPress plugin demonstrating remote license key activation, daily transient validation, and deactivation.
- [lemonjs-checkout-overlay/](examples/lemonjs-checkout-overlay/) — Standalone HTML5 and JavaScript demo for Lemon.js popup checkout overlays with custom metadata and event listeners.

---

## ⚠️ Critical Architectural Traps (Must Follow)

1. **HMAC Webhook Timing Attacks:**
   Always use `crypto.timingSafeEqual` in Node.js or `hash_equals` in PHP to verify the `X-Signature` header. Never use `===`.
2. **Raw Body Before JSON Parsing:**
   In Express or Next.js, verify the signature against the **raw body buffer/text**. If parsed into JSON first, white-space differences will cause verification failures.
3. **Integer Cents Representation:**
   All monetary amounts in the API are in **cents** as integers (`$19.99` = `1999`). Never perform currency math in floating points.
4. **License API Does Not Require API Keys:**
   Endpoints under `/v1/licenses/...` (relative to the API host) are public client endpoints designed to be called from client apps (desktop/plugin) without exposing master secret keys.
5. **Subscription Cancellation Grace Period:**
   Deleting a subscription via API sets `cancelled: true` and sets `ends_at` to the end of the paid period. Do NOT revoke customer access immediately; allow access until `ends_at`.

---

## 🛠 Production Implementation Templates

### 1. Next.js App Router Timing-Safe Webhook Route (`app/api/webhook/route.ts`)
```typescript
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';

export async function POST(req: NextRequest) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!;
  const rawBody = await req.text(); // Raw unparsed text
  const signature = req.headers.get('x-signature') || '';

  const hmac = crypto.createHmac('sha256', secret);
  const digest = Buffer.from(hmac.update(rawBody, 'utf8').digest('hex'), 'utf8');
  const signatureBuffer = Buffer.from(signature, 'utf8');

  if (digest.length !== signatureBuffer.length || !crypto.timingSafeEqual(digest, signatureBuffer)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  const event = payload.meta.event_name;
  const customData = payload.meta.custom_data || {};

  switch (event) {
    case 'order_created':
      // Fulfill purchase (user_id in customData.user_id)
      break;
    case 'subscription_created':
    case 'subscription_updated':
      // Update subscription status in database (active, past_due, paused)
      break;
    case 'subscription_cancelled':
      // Mark subscription ending at payload.data.attributes.ends_at
      break;
  }

  return NextResponse.json({ received: true });
}
```

### 2. WordPress / PHP Timing-Safe Webhook Listener
```php
<?php
defined('ABSPATH') || exit;

add_action('rest_api_init', function () {
    register_rest_route('my-addon/v1', '/lemon-webhook', [
        'methods'             => 'POST',
        'permission_callback' => '__return_true',
        'callback'            => function (\WP_REST_Request $request) {
            $secret = get_option('my_ls_webhook_secret');
            $rawBody = $request->get_body();
            $signature = $request->get_header('x-signature');

            $expected = hash_hmac('sha256', $rawBody, $secret);

            if (!hash_equals($expected, $signature)) {
                return new \WP_Error('invalid_signature', 'Signature verification failed', ['status' => 401]);
            }

            $payload = json_decode($rawBody, true);
            $event = $payload['meta']['event_name'] ?? '';

            if ($event === 'order_created') {
                $orderId = $payload['data']['id'];
                $userEmail = $payload['data']['attributes']['user_email'];
                // Fulfill order
            }

            return rest_ensure_response(['success' => true]);
        }
    ]);
});
```

### 3. Client Software License Validation with 24h Offline Cache
```php
function verify_lemon_license(string $licenseKey, string $instanceId): bool
{
    $cacheKey = 'ls_license_valid_' . md5($licenseKey);
    $cached = get_transient($cacheKey);
    if ($cached !== false) {
        return $cached === 'valid';
    }

    $response = wp_remote_post('https://api.lemonsqueezy.com/v1/licenses/validate', [
        'timeout' => 10,
        'body'    => [
            'license_key' => $licenseKey,
            'instance_id' => $instanceId
        ]
    ]);

    if (is_wp_error($response)) {
        return true; // Graceful offline fallback during temporary network outages
    }

    $data = json_decode(wp_remote_retrieve_body($response), true);
    $isValid = !empty($data['valid']);

    set_transient($cacheKey, $isValid ? 'valid' : 'invalid', DAY_IN_SECONDS);
    return $isValid;
}
```

### 4. Lemon.js Popup Overlay & Custom Data
```html
<!-- Include script -->
<script src="https://assets.lemonsqueezy.com/lemon.js" defer></script>

<!-- Anchor link with lemonsqueezy-button class -->
<a href="https://store.lemonsqueezy.com/buy/variant_123?checkout[custom][user_id]=42&checkout[email]=buyer@example.com"
   class="lemonsqueezy-button btn">
  Subscribe Now
</a>

<script>
  window.createLemonSqueezy = function () {
    window.LemonSqueezy.Setup({
      eventHandler: (event) => {
        if (event.event === 'Checkout.Success') {
          console.log('Order complete!', event.data.order.id);
        }
      }
    });
  };
</script>
```

---

## ⚡ Fastr MCP Server Tools Guidance (Lemon Squeezy)

When the **`lemonsqueezy-developer`** MCP server is connected, AI coding assistants must use these dedicated tools instead of guessing JSON:API bodies or cryptographic parameters:

| Tool | Purpose | Typical User Query |
|---|---|---|
| `ls_search_docs` | Search curated Lemon Squeezy documentation across webhooks, checkouts, subscriptions, and licensing. | *"How does dunning retry work in Lemon Squeezy?"* |
| `ls_get_schema` | Returns the exact JSON:API body structure and required relationships for any resource. | *"Show me the exact payload to create a checkout via API."* |
| `ls_get_reference` | Read any of the 7 official Lemon Squeezy reference manuals in full or by heading. | *"Show me the Webhook Event Catalog from webhooks-and-security.md."* |
| `ls_verify_webhook` | Test and verify incoming raw request bodies and HMAC-SHA256 signatures safely. | *"Verify this test webhook payload against my signing secret."* |
| `ls_validate_license` | Live validation of a customer license key against the official API. | *"Check if license key 8a4b-xxxx is active."* |

