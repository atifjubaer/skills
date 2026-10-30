# Subscriptions API

Manage recurring subscriptions including listing, cancellation, reactivation, payment method updates, and customer self-service operations.

**Base URL:** `https://your-site.com/wp-json/fluent-cart/v2`

> All monetary values are in cents (e.g., `$10.00` = `1000`).

---

## Endpoints Overview

### Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/subscriptions` | List Subscriptions |
| GET | `/subscriptions/{subscriptionOrderId}` | Get Subscription Details |
| PUT | `/orders/{order}/subscriptions/{subscription}/cancel` | Cancel Subscription |
| PUT | `/orders/{order}/subscriptions/{subscription}/fetch` | Fetch Subscription from Remote |
| POST | `/orders/{order}/subscriptions/{subscription}/early-payment-link` | Generate Early Payment Link |
| PUT | `/orders/{order}/subscriptions/{subscription}/reactivate` | Reactivate Subscription (Reserved) |
| PUT | `/orders/{order}/subscriptions/{subscription}/pause` | Pause Subscription (Reserved) |
| PUT | `/orders/{order}/subscriptions/{subscription}/resume` | Resume Subscription (Reserved) |
| POST | `/orders/{order}/subscriptions/{subscription}/charge-now` | Charge Subscription Now |
| POST | `/orders/{order}/subscriptions/{subscription}/create-renewal` | Create Renewal Now |
| POST | `/orders/{order}/subscriptions/{subscription}/skip-renewal` | Skip Next Renewal Period |
| PUT | `/orders/{order}/subscriptions/{subscription}/update` | Update Subscription |
| PUT | `/orders/{order}/subscriptions/{subscription}/vendor-ids` | Update Vendor IDs |
| POST | `/orders/{order}/subscriptions/{subscription}/verify-vendor-ids` | Verify Vendor IDs |

### Renewal Invoices

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/renewals` | List Renewal Invoices |
| GET | `/renewals/{id}` | Get Renewal Invoice Details |
| POST | `/renewals/{order}/resend` | Resend Renewal Invoice Email |
| POST | `/renewals/{order}/void` | Void Renewal Invoice |

### Customer Portal Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/customer-profile/subscriptions` | List Customer Subscriptions |
| GET | `/customer-profile/subscriptions/{subscription_uuid}` | Get Customer Subscription Details |
| GET | `/customer-profile/subscriptions/{subscription_uuid}/setup-intent-attempts` | Get Setup Intent Attempts |
| POST | `/customer-profile/subscriptions/{subscription_uuid}/update-payment-method` | Update Payment Method |
| POST | `/customer-profile/subscriptions/{subscription_uuid}/get-or-create-plan` | Get or Create Plan |
| POST | `/customer-profile/subscriptions/{subscription_uuid}/switch-payment-method` | Switch Payment Method |
| POST | `/customer-profile/subscriptions/{subscription_uuid}/confirm-subscription-switch` | Confirm Subscription Switch |
| POST | `/customer-profile/subscriptions/{subscription_uuid}/cancel-auto-renew` | Cancel Auto-Renew |
| POST | `/customer-profile/subscriptions/{subscription_uuid}/initiate-early-payment` | Initiate Early Payment |

---

## Admin Endpoints

Admin endpoints require an authenticated WordPress user with the appropriate FluentCart capability. Authorization is handled by `OrderPolicy`.

### List Subscriptions

`GET /fluent-cart/v2/subscriptions`

Retrieve a paginated list of subscriptions with optional filtering, sorting, and search.

**Permission:** `subscriptions/view`

**Policy:** `OrderPolicy`

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `page` | integer | query | No | Page number for pagination |
| `per_page` | integer | query | No | Number of records per page (default: 10, max: 200) |
| `search` | string | query | No | Search term (`#123` for ID, `user@example.com` for email, `canceled`, or general text across vendor IDs, payment method, interval) |
| `sort_by` | string | query | No | Column to sort by (default: `id`) |
| `sort_type` | string | query | No | Sort direction: `asc` or `desc` (default: `desc`) |
| `active_view` | string | query | No | Tab filter: `active`, `pending`, `intended`, `paused`, `trialing`, `canceled`, `failing`, `expiring`, `expired` |
| `filter_type` | string | query | No | Filter mode: `simple` (default) or `advanced` |
| `advanced_filters` | string (JSON) | query | No | JSON-encoded array of advanced filter groups (requires Pro) |
| `with` | array/string | query | No | Eager-load relations |
| `select` | array/string | query | No | Comma-separated list of columns to select |
| `scopes` | array | query | No | Model scopes to apply |
| `include_ids` | array/string | query | No | Comma-separated IDs that must always be included |
| `limit` | integer | query | No | Limit number of records |
| `offset` | integer | query | No | Offset for records |
| `user_tz` | string | query | No | User timezone for date filtering (e.g., `America/New_York`) |

#### Response

```json
{
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "uuid": "abc123-def456",
        "status": "active",
        "item_name": "Pro Plan",
        "parent_order_id": 10,
        "customer_id": 5,
        "product_id": 3,
        "variation_id": 7,
        "vendor_subscription_id": "sub_1234567890",
        "vendor_customer_id": "cus_abc123",
        "vendor_plan_id": "price_xyz789",
        "current_payment_method": "stripe",
        "billing_interval": "monthly",
        "recurring_amount": 2999,
        "bill_times": 0,
        "bill_count": 6,
        "next_billing_date": "2025-02-15 00:00:00",
        "created_at": "2025-01-15 10:30:00",
        "updated_at": "2025-01-15 10:35:00"
      }
    ],
    "per_page": 10,
    "total": 50,
    "last_page": 5
  }
}
```

#### Example

```bash
curl -X GET "https://example.com/wp-json/fluent-cart/v2/subscriptions?page=1&per_page=10&active_view=active" \
  -u "username:app_password"
```

---

### Get Subscription Details

`GET /fluent-cart/v2/subscriptions/{subscriptionOrderId}`

Retrieve the full details of a single subscription including customer addresses, labels, activities, and related orders.

**Permission:** `subscriptions/view`

**Policy:** `OrderPolicy`

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `subscriptionOrderId` | integer | path | Yes | The subscription ID |

#### Response

```json
{
  "subscription": {
    "id": 1,
    "uuid": "abc123-def456",
    "status": "active",
    "item_name": "Pro Plan",
    "parent_order_id": 10,
    "customer_id": 5,
    "product_id": 3,
    "variation_id": 7,
    "vendor_subscription_id": "sub_1234567890",
    "vendor_customer_id": "cus_abc123",
    "current_payment_method": "stripe",
    "billing_interval": "monthly",
    "recurring_amount": 2999,
    "bill_times": 0,
    "bill_count": 6,
    "next_billing_date": "2025-02-15 00:00:00",
    "billing_address": { ... },
    "shipping_address": { ... },
    "labels": [ ... ],
    "activities": [ ... ],
    "customer": {
      "id": 5,
      "shipping_address": { ... },
      "billing_address": { ... }
    },
    "related_orders": [
      {
        "id": 10,
        "order_items": [
          {
            "id": 1,
            "order_id": 10,
            "post_title": "Pro Plan",
            "title": "Pro Plan",
            "quantity": 1,
            "payment_type": "subscription",
            "line_meta": { ... }
          }
        ]
      }
    ]
  },
  "selected_labels": [1, 3, 5]
}
```

#### Example

```bash
curl -X GET "https://example.com/wp-json/fluent-cart/v2/subscriptions/1" \
  -u "username:app_password"
```

---

### Cancel Subscription

`PUT /fluent-cart/v2/orders/{order}/subscriptions/{subscription}/cancel`

Cancel a subscription both locally and with the remote payment gateway.

**Permission:** `subscriptions/manage`

**Policy:** `OrderPolicy`

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `order` | integer | path | Yes | The parent order ID |
| `subscription` | integer | path | Yes | The subscription ID |
| `cancel_reason` | string | body | Yes | Reason for cancellation |

#### Response

```json
{
  "message": "Subscription has been cancelled successfully!",
  "subscription": {
    "id": 1,
    "status": "canceled"
  }
}
```

#### Example

```bash
curl -X PUT "https://example.com/wp-json/fluent-cart/v2/orders/10/subscriptions/1/cancel" \
  -u "username:app_password" \
  -H "Content-Type: application/json" \
  -d '{"cancel_reason": "Customer requested cancellation"}'
```

---

### Fetch Subscription from Remote

`PUT /fluent-cart/v2/orders/{order}/subscriptions/{subscription}/fetch`

Re-sync a subscription's data from the remote payment gateway (e.g., Stripe, PayPal).

**Permission:** `subscriptions/view`

**Policy:** `OrderPolicy`

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `order` | integer | path | Yes | The parent order ID |
| `subscription` | integer | path | Yes | The subscription ID |

#### Response

```json
{
  "message": "Subscription fetched successfully from remote payment gateway!",
  "subscription": {
    "id": 1,
    "status": "active",
    "vendor_subscription_id": "sub_1234567890"
  }
}
```

#### Example

```bash
curl -X PUT "https://example.com/wp-json/fluent-cart/v2/orders/10/subscriptions/1/fetch" \
  -u "username:app_password"
```

---

### Generate Early Payment Link

`POST /fluent-cart/v2/orders/{order}/subscriptions/{subscription}/early-payment-link`

Generate a URL that allows early payment of remaining installments on an installment-based subscription.

**Permission:** `subscriptions/manage`

**Policy:** `OrderPolicy`

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `order` | integer | path | Yes | The parent order ID |
| `subscription` | integer | path | Yes | The subscription ID |

#### Response

```json
{
  "message": "Early payment link generated.",
  "payment_url": "https://your-site.com/?fluent-cart=early-installment-payment&subscription_hash=abc123-def456"
}
```

#### Example

```bash
curl -X POST "https://example.com/wp-json/fluent-cart/v2/orders/10/subscriptions/1/early-payment-link" \
  -u "username:app_password"
```

---

### Charge Subscription Now

`POST /fluent-cart/v2/orders/{order}/subscriptions/{subscription}/charge-now`

Run one immediate off-session charge attempt against a subscription's open renewal invoice. Requires a store-billed (manual or auto-charge) subscription that already has a pending or scheduled renewal order.

A declined card is returned as **HTTP 200 with `status: "failed"`** — the request itself succeeded, the charge attempt did not. Only a state violation (e.g. no open renewal order to charge) returns an error response, so branch on the body, not solely on the status code.

**Permission:** `subscriptions/manage`

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `order` | integer | path | Yes | Parent order ID the subscription belongs to |
| `subscription` | integer | path | Yes | Subscription ID |

#### Example

```bash
curl -X POST "https://example.com/wp-json/fluent-cart/v2/orders/10/subscriptions/1/charge-now" \
  -u "username:app_password"
```

---

### Create Renewal Now

`POST /fluent-cart/v2/orders/{order}/subscriptions/{subscription}/create-renewal`

Immediately create the next renewal order for a store-billed (manual or auto-charge) subscription, ahead of its scheduled billing date. Only valid for `active` or `trialing` subscriptions that have an upcoming billing date.

For auto-charge (system) subscriptions the newly created — or already-open — renewal is charged immediately; for manual subscriptions it produces an invoice the customer pays.

**Permission:** `subscriptions/manage`

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `order` | integer | path | Yes | Parent order ID the subscription belongs to |
| `subscription` | integer | path | Yes | Subscription ID |

#### Example

```bash
curl -X POST "https://example.com/wp-json/fluent-cart/v2/orders/10/subscriptions/1/create-renewal" \
  -u "username:app_password"
```

---

### Skip Next Renewal Period

`POST /fluent-cart/v2/orders/{order}/subscriptions/{subscription}/skip-renewal`

Advance a store-billed (manual or auto-charge) subscription's `next_billing_date` to the following period **without** creating or charging a renewal for the current one. Only valid for `active` or `trialing` subscriptions with an upcoming billing date.

The skip does not stack — if a skip is already pending, or there is nothing left to advance, the request fails.

**Permission:** `subscriptions/manage`

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `order` | integer | path | Yes | Parent order ID the subscription belongs to |
| `subscription` | integer | path | Yes | Subscription ID |
| `reason` | string | body | No | Note recorded against the skip |

#### Example

```bash
curl -X POST "https://example.com/wp-json/fluent-cart/v2/orders/10/subscriptions/1/skip-renewal" \
  -u "username:app_password" \
  -H "Content-Type: application/json" \
  -d '{"reason":"Customer travelling"}'
```

---

### Update Subscription

`PUT /fluent-cart/v2/orders/{order}/subscriptions/{subscription}/update`

Update a manual subscription's billing details — recurring amount, remaining bill count, billing interval, status, or next billing date. Only subscriptions with a **manual** collection method can be updated through this endpoint; system (auto-charge) and gateway-managed subscriptions are rejected.

> `recurring_total` is a decimal amount in the store's currency (e.g. `29.99`), **not cents** — unlike almost every other money field in this API.

**Permission:** `subscriptions/manage`

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `order` | integer | path | Yes | Parent order ID the subscription belongs to |
| `subscription` | integer | path | Yes | Subscription ID |
| `status` | string | body | Yes | New status: `active`, `paused`, `trialing`, `canceled`, `expired`, `completed`, `past_due` |
| `recurring_total` | number | body | No | New recurring amount as a decimal (`29.99`), not cents |
| `bill_times` | integer | body | No | Number of remaining billing cycles |
| `billing_interval` | string | body | No | Interval label (e.g. `monthly`, `yearly`) |
| `next_billing_date` | string | body | No | Any string `strtotime()` can parse |

#### Example

```bash
curl -X PUT "https://example.com/wp-json/fluent-cart/v2/orders/10/subscriptions/1/update" \
  -u "username:app_password" \
  -H "Content-Type: application/json" \
  -d '{"status":"active","recurring_total":29.99,"billing_interval":"monthly","bill_times":12}'
```

---

### Update Vendor IDs

`PUT /fluent-cart/v2/orders/{order}/subscriptions/{subscription}/vendor-ids`

Correct the gateway identifiers (`vendor_subscription_id`, `vendor_customer_id`) on a gateway-billed subscription.

Opt-in: the endpoint returns an error unless the site returns `true` from the `fluent_cart/subscription/vendor_id_editing_enabled` filter. It writes only the identifier columns — no renewal is voided, no invoice re-synced, no status event dispatched, and the payment gateway is not called. Only the keys you send are written; send an empty string to clear one.

The new `vendor_subscription_id` is claimed atomically, so another subscription on the same payment method cannot already hold it.

**Permission:** `subscriptions/manage`

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `order` | integer | path | Yes | The parent order ID |
| `subscription` | integer | path | Yes | The subscription ID |
| `vendor_subscription_id` | string | body | No | Subscription ID at the payment gateway. Empty string clears it; omit to leave untouched. Max 45 chars, `^[a-zA-Z0-9_.-]+$` |
| `vendor_customer_id` | string | body | No | Customer ID at the payment gateway. Empty string clears it; omit to leave untouched. Max 45 chars, `^[a-zA-Z0-9_.-]+$` |

#### Example

```bash
curl -X PUT "https://example.com/wp-json/fluent-cart/v2/orders/10/subscriptions/1/vendor-ids" \
  -u "username:app_password" \
  -H "Content-Type: application/json" \
  -d '{"vendor_subscription_id":"sub_1QxYzAbC"}'
```

---

### Verify Vendor IDs

`POST /fluent-cart/v2/orders/{order}/subscriptions/{subscription}/verify-vendor-ids`

Read-only lookup of a candidate vendor subscription ID at the payment gateway, used before saving a correction. Writes nothing locally and nothing at the gateway.

Requires the `fluent_cart/subscription/vendor_id_editing_enabled` filter and a gateway declaring the `verify_vendor_ids` capability (Stripe and PayPal); other gateways return an error. A successful lookup proves the ID exists in the merchant account whose credentials this store holds — it is **not** proof of ownership, since one merchant account can back several stores.

**Permission:** `subscriptions/manage`

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `order` | integer | path | Yes | The parent order ID |
| `subscription` | integer | path | Yes | The subscription ID |
| `vendor_subscription_id` | string | body | No | The candidate subscription ID to look up. Max 45 chars, `^[a-zA-Z0-9_.-]+$` |
| `vendor_customer_id` | string | body | No | The candidate customer ID. Sent because some gateways nest the subscription under its customer. Max 45 chars, `^[a-zA-Z0-9_.-]+$` |

#### Response

```json
{
  "message": "Subscription found at the payment gateway.",
  "verification": {
    "id": "sub_1PxaBcDeFgHiJkLmNoPqRsTu",
    "status": "active",
    "customer_id": "cus_QrStUvWxYz012345",
    "amount": 9900,
    "currency": "USD",
    "next_billing_date": "2027-05-29 12:35:43"
  }
}
```

#### Example

```bash
curl -X POST "https://example.com/wp-json/fluent-cart/v2/orders/10/subscriptions/1/verify-vendor-ids" \
  -u "username:app_password" \
  -H "Content-Type: application/json" \
  -d '{"vendor_subscription_id":"sub_1P9xyzABCdef","vendor_customer_id":"cus_NffrFeUfNV2Hib"}'
```

---

### Reserved Admin Endpoints

- `PUT /fluent-cart/v2/orders/{order}/subscriptions/{subscription}/reactivate`
- `PUT /fluent-cart/v2/orders/{order}/subscriptions/{subscription}/pause`
- `PUT /fluent-cart/v2/orders/{order}/subscriptions/{subscription}/resume`

*Note: Registered but currently return "Not available yet". Reserved for future implementation.*

---

## Renewal Invoices

A renewal invoice is just an order with `type = "renewal"`, so these endpoints read and act on the order record rather than a separate table. They are the admin-side controls for chasing and cleaning up unpaid renewals.

### List Renewal Invoices

`GET /fluent-cart/v2/renewals`

List orders of type `renewal` (subscription renewal invoices), newest first, paginated. Each row includes its `customer` relation.

**Permission:** `orders/view`

**Policy:** `OrderPolicy`

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `payment_status` | string | query | No | Filter by payment status (e.g. `paid`, `pending`, `failed`) |
| `parent_id` | integer | query | No | Only renewal invoices belonging to this parent order ID |
| `customer_id` | integer | query | No | Only renewal invoices belonging to this customer ID |

#### Response

```json
{
  "invoices": {
    "current_page": 1,
    "data": [
      {
        "id": 5151,
        "status": "completed",
        "parent_id": "1880",
        "receipt_number": "6322",
        "invoice_no": "INV-6322",
        "fulfillment_type": "digital",
        "type": "renewal",
        "mode": "live",
        "shipping_status": "unshipped",
        "customer_id": 1484
      }
    ]
  }
}
```

`invoices` is a Laravel paginator payload (`current_page`, `data`, `total`, `per_page`, …).

---

### Get Renewal Invoice Details

`GET /fluent-cart/v2/renewals/{id}`

Retrieve a single renewal invoice, including its customer, order items and transactions.

**Permission:** `orders/view`

**Policy:** `OrderPolicy`

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `id` | integer | path | Yes | Renewal order ID |

---

### Resend Renewal Invoice Email

`POST /fluent-cart/v2/renewals/{order}/resend`

Resend the pay-now email for a pending renewal invoice. Only allowed when `payment_status = pending`.

If the invoice belongs to a system (store-managed) subscription that is still mid-retry, the resend is **blocked until the automatic retry ladder is exhausted**, so it never overlaps the dunning emails.

**Permission:** `orders/manage`

**Policy:** `OrderPolicy`

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `order` | integer | path | Yes | Renewal order ID |

#### Response

```json
{ "message": "Renewal order email has been resent" }
```

---

### Void Renewal Invoice

`POST /fluent-cart/v2/renewals/{order}/void`

Cancel a pending or scheduled renewal invoice. This is not a soft delete — it:

1. sets the order's `payment_status` to `failed` and `status` to `canceled`,
2. fails any pending transactions on it,
3. advances the subscription past this billing period, so the scheduler does not immediately regenerate the same invoice,
4. recounts the customer's stats.

If a concurrent webhook pays the invoice between validation and the update, the void is **rejected** rather than overwriting a paid invoice.

**Permission:** `orders/manage`

**Policy:** `OrderPolicy`

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `order` | integer | path | Yes | Renewal order ID |

#### Response

```json
{ "message": "Renewal order has been voided successfully" }
```

---

## Customer Portal Endpoints

Authenticated via logged-in WordPress user session. Uses subscription `uuid` (not numeric ID). Authorization: `CustomerFrontendPolicy`.

### List Customer Subscriptions

`GET /fluent-cart/v2/customer-profile/subscriptions`

Retrieve a paginated list of subscriptions belonging to the currently logged-in customer. Pending/intended subscriptions are excluded.

**Auth:** Logged-in WordPress user

**Policy:** `CustomerFrontendPolicy`

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `page` | integer | query | No | Page number for pagination (default: 1) |
| `per_page` | integer | query | No | Number of records per page (default: 10) |

#### Response

```json
{
  "message": "Success",
  "subscriptions": {
    "data": [
      {
        "uuid": "abc123-def456",
        "status": "active",
        "item_name": "Pro Plan",
        "billing_interval": "monthly",
        "recurring_amount": 2999,
        "next_billing_date": "2025-02-15 00:00:00",
        "bill_times": 0,
        "bill_count": 6
      }
    ],
    "total": 5,
    "per_page": 10,
    "current_page": 1,
    "last_page": 1
  }
}
```

#### Example

```bash
curl -X GET "https://example.com/wp-json/fluent-cart/v2/customer-profile/subscriptions?page=1&per_page=10" \
  -H "X-WP-Nonce: <nonce>"
```

---

### Get Customer Subscription Details

`GET /fluent-cart/v2/customer-profile/subscriptions/{subscription_uuid}`

Retrieve full details of a specific subscription for the currently logged-in customer, including transactions, upgrade eligibility, and payment method capabilities.

**Auth:** Logged-in WordPress user

**Policy:** `CustomerFrontendPolicy`

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `subscription_uuid` | string | path | Yes | The subscription UUID |

#### Response

```json
{
  "message": "Success",
  "subscription": {
    "uuid": "abc123-def456",
    "status": "active",
    "overridden_status": null,
    "vendor_subscription_id": "sub_1234567890",
    "next_billing_date": "2025-02-15 00:00:00",
    "billing_info": {
      "interval": "monthly",
      "interval_count": 1,
      "amount": 2999,
      "currency": "USD"
    },
    "current_payment_method": "stripe",
    "payment_method": "stripe",
    "bill_times": 0,
    "bill_count": 6,
    "variation_id": 7,
    "product_id": 3,
    "reactivate_url": "https://your-site.com/?fluent-cart=reactivate&hash=abc123",
    "title": "Pro Plan",
    "can_upgrade": true,
    "can_switch_payment_method": true,
    "switchable_payment_methods": ["stripe", "paypal"],
    "can_update_payment_method": true,
    "order": {
      "uuid": "order-uuid-here"
    },
    "billing_addresses": [ ... ],
    "recurring_amount": 2999,
    "can_early_pay": false,
    "remaining_installments": 0,
    "transactions": [ ... ]
  }
}
```

#### Example

```bash
curl -X GET "https://example.com/wp-json/fluent-cart/v2/customer-profile/subscriptions/abc123-def456" \
  -H "X-WP-Nonce: <nonce>"
```

---

### Get Setup Intent Remaining Attempts

`GET /fluent-cart/v2/customer-profile/subscriptions/{subscription_uuid}/setup-intent-attempts`

Check remaining Stripe SetupIntent attempts (Stripe only).

**Auth:** Logged-in WordPress user

#### Response

```json
{
  "remaining": 5
}
```

---

### Update Payment Method

`POST /fluent-cart/v2/customer-profile/subscriptions/{subscription_uuid}/update-payment-method`

Update the payment method card/details on file within the same payment gateway.

**Auth:** Logged-in WordPress user

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `subscription_uuid` | string | path | Yes | The subscription UUID |
| `data.method` | string | body | Yes | Gateway slug (e.g., `stripe`, `paypal`) |

#### Example

```bash
curl -X POST "https://example.com/wp-json/fluent-cart/v2/customer-profile/subscriptions/abc123-def456/update-payment-method" \
  -H "X-WP-Nonce: <nonce>" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "method": "stripe",
      "payment_method_id": "pm_1234567890"
    }
  }'
```

---

### Get or Create Plan

`POST /fluent-cart/v2/customer-profile/subscriptions/{subscription_uuid}/get-or-create-plan`

Ensure target gateway has a matching plan configured during payment method switch.

**Auth:** Logged-in WordPress user

---

### Switch Payment Method

`POST /fluent-cart/v2/customer-profile/subscriptions/{subscription_uuid}/switch-payment-method`

Switch payment method from one gateway to another (e.g., Stripe to PayPal).

**Auth:** Logged-in WordPress user

#### Example

```bash
curl -X POST "https://example.com/wp-json/fluent-cart/v2/customer-profile/subscriptions/abc123-def456/switch-payment-method" \
  -H "X-WP-Nonce: <nonce>" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "newPaymentMethod": "paypal",
      "currentPaymentMethod": "stripe"
    }
  }'
```

---

### Confirm Subscription Switch

`POST /fluent-cart/v2/customer-profile/subscriptions/{subscription_uuid}/confirm-subscription-switch`

Confirm a two-step payment method switch on the target gateway.

**Auth:** Logged-in WordPress user

---

### Cancel Auto-Renew

`POST /fluent-cart/v2/customer-profile/subscriptions/{subscription_uuid}/cancel-auto-renew`

Cancel auto-renewal from customer portal (reasons set to `cancelled_by_customer`).

**Auth:** Logged-in WordPress user

#### Response

```json
{
  "message": "Your subscription has been successfully cancelled"
}
```

#### Example

```bash
curl -X POST "https://example.com/wp-json/fluent-cart/v2/customer-profile/subscriptions/abc123-def456/cancel-auto-renew" \
  -H "X-WP-Nonce: <nonce>"
```

---

### Initiate Early Payment

`POST /fluent-cart/v2/customer-profile/subscriptions/{subscription_uuid}/initiate-early-payment`

Generate a checkout URL for paying remaining installments early on installment subscriptions.

**Auth:** Logged-in WordPress user

#### Response

```json
{
  "message": "Early payment URL generated.",
  "checkout_url": "https://your-site.com/?fluent-cart=early-installment-payment&subscription_hash=abc123-def456"
}
```

---

## Subscription Statuses & Hooks Reference

### Statuses

| Status | Constant | Description |
|--------|----------|-------------|
| `pending` | `SUBSCRIPTION_PENDING` | Created but not yet activated |
| `intended` | `SUBSCRIPTION_INTENDED` | Payment intent created, awaiting completion |
| `trialing` | `SUBSCRIPTION_TRIALING` | In trial period |
| `active` | `SUBSCRIPTION_ACTIVE` | Active and billing normally |
| `paused` | `SUBSCRIPTION_PAUSED` | Temporarily paused |
| `failing` | `SUBSCRIPTION_FAILING` | Payment attempts failing |
| `expiring` | `SUBSCRIPTION_EXPIRING` | Approaching expiration |
| `expired` | `SUBSCRIPTION_EXPIRED` | Expired |
| `canceled` | `SUBSCRIPTION_CANCELED` | Cancelled by admin or customer |
| `past_due` | `SUBSCRIPTION_PAST_DUE` | Payment is overdue |
| `completed` | `SUBSCRIPTION_COMPLETED` | All installments paid |
| `authenticated` | `SUBSCRIPTION_AUTHENTICATED` | SCA flow completed |
| `created` | `SUBSCRIPTION_CREATED` | Created on remote gateway |

### Hooks & Filters

- `fluent_cart/subscription/view` — Filter subscription data before returning in admin detail view.
- `fluent_cart/customer_portal/subscription_data` — Filter subscription data in customer portal detail view.
- `fluent_cart/subscriptions_list_filter_query` — Filter subscription list query before execution.
- `fluent_cart/subscriptions_filter/{provider}/{property}` — Custom advanced filter handler.
