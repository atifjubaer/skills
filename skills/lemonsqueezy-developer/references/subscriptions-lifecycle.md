<!--
Source:    https://docs.lemonsqueezy.com/api
Topic:     Subscriptions and Invoices — lifecycle, pauses, cancellations, plan changes
Retrieved: 2026-10-28 (date added to this repo; no scrape timestamp was recorded)
-->

# Lemon Squeezy Subscriptions Lifecycle & Invoices API

Comprehensive guide for managing SaaS billing, plan migrations, pauses, cancellations, and invoices.

---

## 1. Subscription Status State Machine

A Lemon Squeezy subscription exists in one of the following states:

```text
[on_trial] ────────► [active] ────────► [past_due] (dunning retries)
                       │   │                   │
                       │   │                   ▼
                       │   ├───────────────► [unpaid]
                       │   │                   │
                       │   ▼                   ▼
                       │  [paused] ────► [cancelled] ──► [expired]
                       │                       ▲
                       └───────────────────────┘
```

* `on_trial`: Free trial period is active.
* `active`: Subscription is in good standing with recurring billing active.
* `paused`: Subscription temporarily halted (resumable via API/portal).
* `past_due`: Renewal charge failed; Lemon Squeezy is executing automatic dunning retries.
* `unpaid`: Dunning retries exhausted without payment.
* `cancelled`: Customer or merchant initiated cancellation. Customer still retains access until `ends_at`.
* `expired`: Grace period ended. System must revoke access.

---

## 2. Subscription Endpoints & Actions

### Retrieve Subscription
`GET https://api.example.com/v1/subscriptions/{id}`

### Update Subscription (Change Plan, Quantity, or Pause)
`PATCH https://api.example.com/v1/subscriptions/{id}`

```json
{
  "data": {
    "type": "subscriptions",
    "id": "1",
    "attributes": {
      "variant_id": 25,
      "billing_anchor": 1,
      "cancelled": false,
      "pause": {
        "mode": "void"
      }
    }
  }
}
```

* `pause.mode`: Either `void` (no charges, free pause) or `free` (free trial style pause).
* Set `pause: null` to unpause and resume active billing.

### Cancel Subscription (Immediate or End-of-Period)
`DELETE https://api.example.com/v1/subscriptions/{id}`

> [!NOTE]
> Deleting via API sets the subscription to cancel at the end of the current billing cycle (`cancelled: true`, with `ends_at` set to the next billing date). Customers keep paid access until that date.

---

## 3. Customer Portal URL
Lemon Squeezy provides a hosted billing portal where customers can update payment methods, download invoices, or cancel subscriptions:

Inspect `urls.customer_portal` in the subscription attributes:
```json
"urls": {
  "update_payment_method": "https://my-store.example.com/billing/...",
  "customer_portal": "https://my-store.example.com/billing/..."
}
```
Present this URL in your app's billing settings page so you don't need to build card update UI yourself.
