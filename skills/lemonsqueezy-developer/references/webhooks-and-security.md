# Lemon Squeezy Webhooks & HMAC-SHA256 Security

Webhooks allow your application to receive real-time POST notifications from Lemon Squeezy whenever an order, subscription, invoice, or license key event occurs.

---

## 1. Security & Signature Verification (Critical)

Every webhook sent by Lemon Squeezy includes an `X-Signature` HTTP header containing a hex-encoded HMAC-SHA256 hash of the **raw raw request body** signed with your webhook signing secret.

> [!CAUTION]
> **Never parse JSON before verifying the signature.**
> You must compute the HMAC over the exact binary/raw buffer of the request body. If your framework parses JSON first (e.g. `bodyParser.json()`), white-space differences will cause the signature to fail.

### Node.js / Express Implementation
```typescript
import crypto from 'node:crypto';
import type { Request, Response } from 'express';

export function verifyLemonSqueezyWebhook(
  rawBody: Buffer | string,
  signatureHeader: string | undefined,
  signingSecret: string
): boolean {
  if (!signatureHeader || !signingSecret) return false;

  const hmac = crypto.createHmac('sha256', signingSecret);
  const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
  const signature = Buffer.from(signatureHeader, 'utf8');

  if (digest.length !== signature.length) return false;
  return crypto.timingSafeEqual(digest, signature);
}

// In Express route with raw body:
// app.post('/api/webhooks/lemonsqueezy', express.raw({ type: 'application/json' }), (req, res) => {
//   const isValid = verifyLemonSqueezyWebhook(req.body, req.headers['x-signature'] as string, process.env.LEMONSQUEEZY_WEBHOOK_SECRET!);
//   if (!isValid) return res.status(401).send('Invalid signature');
//   const event = JSON.parse(req.body.toString());
//   ...
// });
```

### Next.js App Router (Route Handler)
```typescript
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-signature');
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!;

  const hmac = crypto.createHmac('sha256', secret);
  const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
  const signatureBuffer = Buffer.from(signature ?? '', 'utf8');

  if (digest.length !== signatureBuffer.length || !crypto.timingSafeEqual(digest, signatureBuffer)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  const eventName = payload.meta.event_name;
  const customData = payload.meta.custom_data; // Pre-filled custom metadata

  // Handle events...
  return NextResponse.json({ received: true }, { status: 200 });
}
```

---

## 2. Webhook Event Catalog

| Event Name | Resource Triggered | Key Actions Needed |
| :--- | :--- | :--- |
| `order_created` | One-time purchases & first recurring order | Grant product access, record transaction, fulfill line items. |
| `order_refunded` | Refund issued from dashboard | Revoke product access or license key. |
| `subscription_created` | New recurring subscription started | Provision tenant, activate user subscription status. |
| `subscription_updated` | Plan changed, paused, resumed, or billing date moved | Update active tiers or billing cycle. |
| `subscription_cancelled` | User or admin cancelled subscription | Set `ends_at` grace period; keep access until period ends. |
| `subscription_resumed` | User unpaused subscription | Restore active service state. |
| `subscription_expired` | Grace period ended after cancellation/non-payment | Cut access, downgrade to free tier. |
| `subscription_paused` | Subscription paused | Pause access if configured. |
| `subscription_unpaused` | Subscription resumed from pause | Restore active access. |
| `subscription_payment_success` | Successful recurring renewal | Log payment invoice, extend subscription period. |
| `subscription_payment_failed` | Recurring charge card failure | Send dunning notification or mark `past_due`. |
| `subscription_payment_recovered`| Dunning succeeded | Return status to `active`. |
| `license_key_created` | License key generated for product | Deliver key to customer via UI/email. |
| `license_key_updated` | Key status or activation limit modified | Sync local license records. |

---

## 3. Webhook Payload Shape (JSON:API)

Every webhook payload delivers the resource under `data` and event metadata under `meta`:

```json
{
  "meta": {
    "event_name": "order_created",
    "custom_data": {
      "user_id": "usr_991823",
      "team_id": "team_442"
    }
  },
  "data": {
    "type": "orders",
    "id": "1",
    "attributes": {
      "store_id": 1,
      "customer_id": 1,
      "identifier": "0fa9561b-90f9-4b47-8a1a-a169bbf28198",
      "order_number": 1,
      "user_name": "John Doe",
      "user_email": "john@example.com",
      "currency": "USD",
      "currency_rate": "1.0000",
      "subtotal": 1000,
      "discount_total": 0,
      "tax": 0,
      "total": 1000,
      "subtotal_usd": 1000,
      "discount_total_usd": 0,
      "tax_usd": 0,
      "total_usd": 1000,
      "status": "paid",
      "status_formatted": "Paid",
      "refunded": false,
      "refunded_at": null,
      "created_at": "2024-05-21T14:14:19.000000Z",
      "updated_at": "2024-05-21T14:14:19.000000Z"
    },
    "relationships": {
      "store": { "links": { "related": "https://api.lemonsqueezy.com/v1/orders/1/store" } },
      "customer": { "links": { "related": "https://api.lemonsqueezy.com/v1/orders/1/customer" } },
      "order-items": { "links": { "related": "https://api.lemonsqueezy.com/v1/orders/1/order-items" } },
      "subscriptions": { "links": { "related": "https://api.lemonsqueezy.com/v1/orders/1/subscriptions" } },
      "license-keys": { "links": { "related": "https://api.lemonsqueezy.com/v1/orders/1/license-keys" } }
    }
  }
}
```
