# Agensi Skill Submission: Lemon Squeezy Developer

## Step 1: Skill ZIP Upload
- **File:** `marketplace/agensi/lemonsqueezy-developer.zip`
- **Logo:** `marketplace/assets/lemonsqueezy-developer-logo.png`

## Step 2: Skill Details
- **Skill Name:** Lemon Squeezy Developer Agent
- **Summary:** Complete developer reference for Lemon Squeezy e-commerce: checkout overlays, HMAC-SHA256 webhooks, subscription lifecycles, and software license keys.
- **Category:** Developer Tools / E-Commerce
- **Tags:** `lemonsqueezy`, `payments`, `subscriptions`, `billing`, `licensing`, `ecommerce`

### Full Description:
```markdown
# Lemon Squeezy Developer Agent

Complete technical reference, architectural manual, and guidance system for integrating **Lemon Squeezy** payments, subscriptions, digital downloads, software licenses, and webhooks into Next.js, Node.js, Laravel, Python, WordPress, or any backend stack.

### What's Included:
- **API Reference:** Comprehensive documentation for Lemon Squeezy JSON:API endpoints (Checkouts, Orders, Subscriptions, License Keys, Variants).
- **HMAC-SHA256 Webhook Security:** Timing-safe signature verification algorithms in Node.js, Python, and PHP to prevent forgery attacks.
- **Subscription Lifecycle Management:** Status transitions (`on_trial`, `active`, `paused`, `past_due`, `unpaid`, `cancelled`, `expired`) and billing webhooks.
- **Software License Engine:** License activation, site verification, deactivation, and seat limits.
- **Lemon.js Checkout Overlays:** Embedded modal checkout implementation and event listener callbacks.

### Pair with Fastr MCP Suite:
For live signature verification tools and remote license validation endpoints, connect our companion MCP server on MCPize:
👉 **[Fastr MCP Suite on MCPize](https://mcpize.com/mcp/fastr-mcp-suite)**
```

## Step 3: See it in Action (Demo)

### The Request (what the buyer types):
```text
How do I securely verify a Lemon Squeezy webhook in Node.js using crypto.timingSafeEqual,
and extract the subscription ID from a subscription_payment_success event?
```

### The Result (what your agent delivers):
```text
Here is the production-grade webhook verification handler for Lemon Squeezy in Node.js.
It enforces HMAC-SHA256 verification using raw binary buffers to prevent timing attacks.

```typescript
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
    console.log(`Subscription ${subscriptionId} renewed for customer ${customerId} until ${renewsAt}`);
  }

  return res.status(200).json({ received: true });
}
```
```

## Step 4: Compatibility
- **Universal SKILL.md Standard:** Compatible with Claude Code, Cursor, Codex CLI, OpenClaw, Gemini CLI, VS Code Copilot.
- **Compatibility Note:** Works offline with any markdown-capable agent.

## Step 5: Pricing
- **Pricing Model:** Free ($0) — drives developer awareness and funnels subscribers to the $19/mo Fastr MCP Suite.
