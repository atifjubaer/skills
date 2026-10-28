---
name: "lemonsqueezy-developer"
description: "Comprehensive developer knowledge base and architectural manual for integrating Lemon Squeezy e-commerce, subscriptions, checkouts, and licensing into any web or mobile stack. Covers JSON:API conventions, checkout sessions, Lemon.js overlays, HMAC-SHA256 webhook security, subscription lifecycles, and software license keys."
summary: "Developer reference for Lemon Squeezy e-commerce: checkout overlays, HMAC-SHA256 webhooks, subscription lifecycles, and software license key validation."
version: "1.0.0"
license: "MIT"
tags:
  - payments
  - subscriptions
  - lemonsqueezy
  - billing
  - licensing
  - ecommerce
keywords:
  - lemonsqueezy
  - payment checkout
  - webhook verification
  - license activation
  - subscription billing
use_cases:
  - Integrating Lemon Squeezy checkout overlays and hosted checkouts
  - Securing and handling Lemon Squeezy webhooks with HMAC-SHA256
  - Validating and managing software license keys
---

# Lemon Squeezy Developer Skill

Complete technical reference, architectural manual, and guidance system for integrating **Lemon Squeezy** payments, subscriptions, digital downloads, software licenses, and webhooks into Next.js, Node.js, Laravel, Python, WordPress, or any backend stack.

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

---

## ⚠️ Critical Architectural Traps (Must Follow)

1. **HMAC Webhook Timing Attacks:**
   Always use `crypto.timingSafeEqual` in Node.js or `hash_equals` in PHP to verify the `X-Signature` header. Never use `===`.
2. **Raw Body Before JSON Parsing:**
   In Express or Next.js, verify the signature against the **raw body buffer/text**. If parsed into JSON first, white-space differences will cause verification failures.
3. **Integer Cents Representation:**
   All monetary amounts in the API are in **cents** as integers (`$19.99` = `1999`). Never perform currency math in floating points.
4. **License API Does Not Require API Keys:**
   Endpoints under `https://api.lemonsqueezy.com/v1/licenses/...` are public client endpoints designed to be called from client apps (desktop/plugin) without exposing master secret keys.
5. **Subscription Cancellation Grace Period:**
   Deleting a subscription via API sets `cancelled: true` and sets `ends_at` to the end of the paid period. Do NOT revoke customer access immediately; allow access until `ends_at`.
