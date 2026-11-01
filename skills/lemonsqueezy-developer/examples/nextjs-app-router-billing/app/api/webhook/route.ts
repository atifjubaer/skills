import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';

/**
 * Lemon Squeezy Timing-Safe Webhook Route Handler (Next.js App Router)
 * Handles order, subscription, and licensing event synchronization.
 */
export async function POST(req: NextRequest) {
  try {
    const signingSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    if (!signingSecret) {
      console.error('[Lemon Squeezy Webhook] Missing LEMONSQUEEZY_WEBHOOK_SECRET env variable');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // 1. Read raw request text (MUST use raw unparsed text for HMAC verification)
    const rawBody = await req.text();
    const signatureHeader = req.headers.get('x-signature') || '';

    // 2. Timing-safe HMAC-SHA256 signature verification
    const hmac = crypto.createHmac('sha256', signingSecret);
    const digest = Buffer.from(hmac.update(rawBody, 'utf8').digest('hex'), 'utf8');
    const signature = Buffer.from(signatureHeader, 'utf8');

    if (digest.length !== signature.length || !crypto.timingSafeEqual(digest, signature)) {
      console.warn('[Lemon Squeezy Webhook] Invalid signature detected');
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
    }

    // 3. Parse JSON:API payload
    const payload = JSON.parse(rawBody);
    const eventName = payload.meta?.event_name;
    const customData = payload.meta?.custom_data || {};
    const userId = customData.user_id;

    console.log(`[Lemon Squeezy Webhook] Received verified event: ${eventName}`);

    // 4. Dispatch event lifecycle
    switch (eventName) {
      case 'order_created': {
        const orderId = payload.data.id;
        const totalCents = payload.data.attributes.total;
        const customerEmail = payload.data.attributes.user_email;
        // Fulfill one-time purchase, send receipt, or grant access
        console.log(`Order ${orderId} created for ${customerEmail} ($${totalCents / 100})`);
        break;
      }

      case 'subscription_created':
      case 'subscription_updated': {
        const subscriptionId = payload.data.id;
        const status = payload.data.attributes.status; // 'active', 'paused', 'past_due', 'unpaid', 'cancelled', 'expired'
        const renewsAt = payload.data.attributes.renews_at;
        const customerPortalUrl = payload.data.attributes.urls?.customer_portal;
        // Sync user subscription status in your database
        console.log(`Subscription ${subscriptionId} status: ${status}, renews at: ${renewsAt}`);
        break;
      }

      case 'subscription_cancelled': {
        const subscriptionId = payload.data.id;
        const endsAt = payload.data.attributes.ends_at;
        // Mark subscription pending cancellation at period end
        console.log(`Subscription ${subscriptionId} cancelled, access ends: ${endsAt}`);
        break;
      }

      case 'license_key_created': {
        const licenseKey = payload.data.attributes.key;
        const activationLimit = payload.data.attributes.activation_limit;
        // Record license key for customer
        console.log(`License key ${licenseKey} created with limit: ${activationLimit}`);
        break;
      }

      default:
        console.log(`[Lemon Squeezy Webhook] Unhandled event type: ${eventName}`);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('[Lemon Squeezy Webhook] Handler error:', error.message);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
