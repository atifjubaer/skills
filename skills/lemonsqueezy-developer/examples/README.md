# Lemon Squeezy Developer Examples & Boilerplates

Production-ready code examples, runnable webhook handlers, checkout implementations, and software license activation scripts for Lemon Squeezy.

---

## Available Examples

### 1. Next.js App Router Webhook & Billing (`nextjs-app-router-billing/`)
- Production-ready Next.js 14/15 Route Handler (`app/api/webhook/route.ts`).
- **Features:**
  - Raw request buffer reading with `await req.text()`.
  - Timing-safe HMAC-SHA256 signature verification with `crypto.timingSafeEqual()`.
  - Lifecycle dispatchers for `order_created`, `subscription_created`, `subscription_updated`, `subscription_cancelled`, and `license_key_created`.
  - Database customer ID and subscription status synchronization.

### 2. WordPress Plugin with Lemon Squeezy Licensing (`wordpress-plugin-lemon-licensing/`)
- Complete commercial WordPress plugin showing remote license management.
- **Features:**
  - Remote license key activation via `https://api.lemonsqueezy.com/v1/licenses/activate`.
  - Daily transient caching and status validation via `/licenses/validate`.
  - Clean deactivation on plugin uninstall via `/licenses/deactivate`.
  - Turnkey admin settings page for key entry with visual status badges.

### 3. Standalone Lemon.js Checkout Overlay (`lemonjs-checkout-overlay/`)
- HTML5 & JavaScript demo of Lemon.js modal checkout integration.
- **Features:**
  - Embedded `https://assets.lemonsqueezy.com/lemon.js` script setup.
  - Passing dynamic custom data (`checkout[custom][user_id]`) and customer prefill.
  - Event listeners for `LemonSqueezy.Event.CheckoutSuccess` and `LemonSqueezy.Event.OverlayClosed`.
