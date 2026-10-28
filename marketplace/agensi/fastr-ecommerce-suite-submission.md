# Agensi Submission Sheet: Fastr E-Commerce Developer Suite

Ready-to-paste metadata for listing the combined 2-in-1 e-commerce developer pack on [Agensi](https://www.agensi.io/dashboard/submit).

---

## 1. Skill Name (<= 60 chars)
```text
Fastr E-Commerce Developer Suite
```

## 2. Summary (<= 300 chars)
```text
The definitive developer knowledge base for modern digital commerce: FluentCart WordPress plugin architecture, custom payment gateways, and Lemon Squeezy subscription checkouts, HMAC-SHA256 webhooks, and software licensing.
```

## 3. Full Description (Markdown)
```markdown
# Fastr E-Commerce Developer Suite

The unified architectural manual and engineering intelligence pack for developers building production-grade digital commerce, subscription engines, and software licensing. Combines deep, source-code-accurate references for both **FluentCart WordPress E-Commerce** and **Lemon Squeezy SaaS Billing**.

## What's Included in This Pack

### 1. FluentCart Developer Pro Agent
Complete architecture reference for the FluentCart e-commerce engine:
- **Hook Catalog:** Action and filter hooks for checkout customization, order state machines, fee surcharges, and cart modifiers.
- **Custom Payment Gateways:** End-to-end implementation blueprints adhering to `AbstractGateway` contracts, IPN/webhook verification, redirect flows, and refund handling.
- **Custom Shipping Carriers:** Dynamic rate calculation providers, packaging dimensions, and fallback logic.
- **Database Architecture:** Exact schema blueprints for all 15 core database tables, foreign keys, index designs, and atomic transaction rules.
- **REST API Reference:** Complete request/response schemas for `/wp-json/fluent-cart/v1/` endpoints with nonce verification and capability checks.

### 2. Lemon Squeezy Developer Agent
Deep engineering guidance for SaaS and digital download monetization:
- **JSON:API Client Implementation:** Full contract reference for stores, products, variants, orders, subscriptions, customers, and discount redemptions.
- **Lemon.js Embedded Overlays:** Dynamic checkout URL creation, embedded checkout modals, prefilled checkout parameters, and custom cart data.
- **HMAC-SHA256 Webhook Security:** Timing-safe signature verification (`crypto.timingSafeEqual`), raw byte stream preservation, replay prevention, and idempotency key handling.
- **Subscription Lifecycle Automation:** Upgrade/downgrade pro-rations, pause/resume state management, dunning workflows, and cancellation grace periods (`ends_at`).
- **Software License Key Server:** Client-side license activation (`/v1/licenses/activate`), instance deactivation, heartbeats, and offline grace periods.

---

## Key Traps & Pitfalls Prevented

1. **HMAC Webhook Timing Vulnerabilities:** Enforces byte-by-byte timing-safe signature comparison on raw binary buffers before any JSON parsing.
2. **Subscription Access Revocation:** Prevents premature customer lockouts by respecting `ends_at` grace periods upon subscription cancellation.
3. **Floating Point Monetary Errors:** Mandates integer cents representations across all pricing logic, fee surcharges, and gateway calculations.
4. **WordPress Gateway Registration:** Eliminates broken checkout integrations by enforcing exact `fluent_cart/payment_methods` and `fluent_cart/payment_method_settings` filter wiring.

---

## Pair with Fastr MCP Suite
For live payment gateway code generation, schema validation, and database querying inside Claude, install our companion MCP server on MCPize:
👉 [Fastr MCP Suite on MCPize](https://mcpize.com/mcp/fastr-mcp-suite)
```

## 4. The Request (Demo Prompt)
```text
I am building a SaaS app with a Next.js frontend and a WordPress marketing site. How do I architect webhook listeners to process both Lemon Squeezy subscription renewals and FluentCart one-time course sales securely?
```

## 5. The Result (Demo Output, >700 chars)
```markdown
### Multi-Platform E-Commerce Webhook Architecture

To handle both Lemon Squeezy recurring SaaS subscriptions and FluentCart one-time transactions securely without cross-talk or signature corruption, implement dedicated, isolated endpoint handlers following these architectural rules:

#### 1. Lemon Squeezy Route Handler (`/api/webhooks/lemonsqueezy/route.ts`)
```typescript
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';

export async function POST(req: NextRequest) {
  // CRITICAL: Read raw binary body buffer BEFORE JSON parsing
  const rawBody = await req.text();
  const signature = req.headers.get('x-signature') ?? '';
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET ?? '';

  const hmac = crypto.createHmac('sha256', secret);
  const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
  const signatureBuffer = Buffer.from(signature, 'utf8');

  // CRITICAL: Timing-safe comparison prevents timing attacks
  if (digest.length !== signatureBuffer.length || !crypto.timingSafeEqual(digest, signatureBuffer)) {
    return NextResponse.json({ error: 'Invalid HMAC signature' }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  const eventName = req.headers.get('x-event-name');

  switch (eventName) {
    case 'subscription_created':
    case 'subscription_updated': {
      const { status, ends_at, customer_id } = payload.data.attributes;
      // Do not revoke access if cancelled; allow until ends_at
      await updateSubscriptionRecord(customer_id, status, ends_at);
      break;
    }
    case 'order_created': {
      const totalCents = payload.data.attributes.total; // Integer cents representation
      await recordOrderTransaction(payload.data.id, totalCents);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
```

#### 2. FluentCart WordPress IPN Listener (`fluentcart-webhook.php`)
```php
<?php
defined('ABSPATH') || exit;

add_action('fluent_cart/webhook_ipn_handle_custom_gateway', function ($data) {
    // Verify HMAC header or shared webhook secret
    $signature = sanitize_text_field($_SERVER['HTTP_X_SIGNATURE'] ?? '');
    $rawPayload = file_get_contents('php://input');
    $secret = get_option('fc_custom_gateway_secret');

    $expected = hash_hmac('sha256', $rawPayload, $secret);
    if (!hash_equals($expected, $signature)) {
        wp_send_json_error(['message' => 'Invalid signature'], 401);
    }

    $event = json_decode($rawPayload, true);
    $orderId = absint($event['order_id']);
    $order = fluentCart('orders')->find($orderId);

    if ($order && $event['status'] === 'completed') {
        $order->status = 'completed';
        $order->save();
        do_action('fluent_cart/order_paid', $order);
    }

    wp_send_json_success(['processed' => true]);
});
```
```

## 6. Compatibility & Pricing
- **Pricing:** Free ($0)
- **Compatibility Note:** Compatible with Claude Code, Cursor, Codex CLI, OpenClaw, Gemini CLI, and any modern LLM supporting Agent Skill specifications.
- **Tags:** `wordpress`, `ecommerce`, `fluentcart`, `payments`, `subscriptions`, `lemonsqueezy`, `billing`, `licensing`
- **Use Cases:**
  - Architecting multi-channel e-commerce checkouts
  - Writing timing-safe HMAC webhook verification handlers
  - Creating custom FluentCart payment gateways and shipping carriers
  - Implementing Lemon.js checkout overlays and software licensing
