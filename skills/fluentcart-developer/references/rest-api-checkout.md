# Checkout API

Public storefront checkout endpoints for submitting orders, calculating cart summaries, loading payment gateway UI configurations, querying shipping method availability, and authenticating users.

**Base URLs:**  
- Checkout: `https://your-site.com/wp-json/fluent-cart/v2/checkout`  
- User Login: `https://your-site.com/wp-json/fluent-cart/v2/user/login`  

**Policy:** `PublicPolicy` (No authentication required for most endpoints)

> All monetary values (shipping charges, unformatted totals) are in **cents** (`$10.00` = `1000`).

---

## Endpoints Overview

| Group | Method | Endpoint | Auth / Headers | Description |
|-------|--------|----------|----------------|-------------|
| **Checkout** | POST | `/checkout/place-order` | Optional | Submit order, validate cart, & initiate payment (Rate limit: 5 req/60s) |
| | GET | `/checkout/get-order-info` | Optional | Get gateway-specific payment UI init config (Stripe Elements, PayPal) |
| | GET | `/checkout/get-checkout-summary-view` | Session/Cookie | Retrieve cart HTML view & totals for selected shipping method |
| | GET | `/checkout/get-available-shipping-methods` | Public | List shipping methods for timezone or country/state |
| | GET | `/checkout/get-shipping-methods-list-view` | Public | Get server-rendered HTML list of shipping methods |
| | GET | `/checkout/get-country-info` | Public | Get country states & localized address field rules |
| **Authentication** | POST | `/user/login` | `X-WP-Nonce` Header | Authenticate user during checkout & set WP auth cookie |

---

## Checkout Endpoints

### 1. Place Order

`POST /fluent-cart/v2/checkout/place-order`

Validates cart, registers/matches customer, creates draft order, and dispatches to selected payment gateway.

> **Rate Limit:** 5 requests per 60 seconds per IP/User.

#### Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `billing_email` | string | Yes | Customer email address (auto-populated for logged-in users) |
| `billing_full_name` | string | Conditional | Full name (required if store uses full name mode) |
| `billing_first_name` | string | Conditional | First name (required if store uses separate name mode) |
| `billing_last_name` | string | Conditional | Last name (required if separate name mode & required field) |
| `billing_country` | string | Conditional | ISO country code (e.g. `US`, `GB`). Defaults to store country |
| `billing_address_1` | string | Conditional | Street address line 1 |
| `billing_address_2` | string | No | Street address line 2 (apt, suite, unit) |
| `billing_city` | string | Conditional | City name |
| `billing_state` | string | Conditional | State/province code (required if country has states) |
| `billing_postcode` | string | Conditional | Postal/ZIP code |
| `billing_phone` | string | No | Customer phone number |
| `billing_tax_id` | string | No | Tax ID / VAT registration number |
| `billing_address_id` | integer | No | Saved customer billing address ID |
| `ship_to_different` | string | No | `yes` to specify separate shipping address. Default: `no` |
| `shipping_full_name` | string | Conditional | Shipping recipient name (required when `ship_to_different` is `yes`) |
| `shipping_country` | string | Conditional | Shipping country code (required when `ship_to_different` is `yes`) |
| `shipping_address_1` | string | Conditional | Shipping street address |
| `shipping_address_2` | string | No | Shipping address line 2 |
| `shipping_city` | string | Conditional | Shipping city |
| `shipping_state` | string | Conditional | Shipping state/province code |
| `shipping_postcode` | string | Conditional | Shipping postal code |
| `shipping_phone` | string | No | Shipping phone number |
| `shipping_address_id` | integer | No | Saved customer shipping address ID |
| `fc_selected_shipping_method` | integer | Conditional | Shipping method ID (required for physical items) |
| `payment_method` | string | Yes | Payment gateway slug (e.g., `stripe`, `paypal`, `cod`, `square`) |
| `order_notes` | string | No | Customer order notes (max 200 chars) |
| `agree_terms` | string | Conditional | Terms agreement flag (required if store setting enabled) |
| `allow_create_account` | string | No | `yes` to register WP user account (when store mode is `user_choice`) |
| `user_tz` | string | No | Customer IANA timezone string (default: `UTC`) |

#### Responses

##### Redirect-Based Gateways (PayPal, Hosted Stripe)

```json
{
  "status": "success",
  "redirect_url": "https://checkout.example.com/pay/cs_...",
  "message": "Order placed successfully"
}
```

##### On-Site Gateways (Stripe Elements)

```json
{
  "status": "success",
  "payment_args": {
    "client_secret": "pi_..._secret_...",
    "checkout_mode": "onsite"
  },
  "order_id": 42,
  "message": "Order placed successfully"
}
```

##### Free / COD Orders

```json
{
  "status": "success",
  "redirect_url": "https://your-site.com/checkout/order-received/?order=abc123",
  "message": "Order placed successfully"
}
```

#### Example

```http
POST https://example.com/wp-json/fluent-cart/v2/checkout/place-order
Content-Type: application/json
X-WP-Nonce: your_nonce_here

{
    "billing_email": "john@example.com",
    "billing_full_name": "John Doe",
    "billing_country": "US",
    "billing_address_1": "123 Main St",
    "billing_city": "New York",
    "billing_state": "NY",
    "billing_postcode": "10001",
    "payment_method": "stripe",
    "user_tz": "America/New_York"
}
```

---

### 2. Get Order Info

`GET /fluent-cart/v2/checkout/get-order-info`

Retrieve payment-gateway-specific setup parameters for frontend payment form initialization.

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `method` | string | query | Yes | Gateway slug (e.g. `stripe`, `paypal`, `square`, `airwallex`) |

#### Response Example (Stripe On-Site)

```json
{
  "status": "success",
  "message": "Order info retrieved!",
  "data": {
    "client_secret": "seti_..._secret_...",
    "publishable_key": "pk_live_..."
  },
  "payment_args": {
    "checkout_mode": "onsite",
    "appearance": { "theme": "stripe" }
  }
}
```

---

### 3. Get Checkout Summary

`GET /fluent-cart/v2/checkout/get-checkout-summary-view`

Retrieve server-rendered HTML item summary and updated pricing totals when changing shipping methods or options.

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `shipping_method_id` | integer | query | No | ID of selected shipping method |

#### Response

```json
{
  "items": {
    "views": "<div class=\"fct-checkout-items\">...rendered HTML...</div>",
    "subtotal": "$50.00",
    "has_subscriptions": false,
    "shipping_charge": 500,
    "unformatted_total": 5500,
    "total": "$55.00",
    "shipping_charge_formated": "$5.00",
    "shipping_method_id": "3"
  }
}
```

---

### 4. Available Shipping Methods Endpoints

- `GET /fluent-cart/v2/checkout/get-available-shipping-methods` — Returns JSON list of methods (`timezone` or `country_code`, `state`).
- `GET /fluent-cart/v2/checkout/get-shipping-methods-list-view` — Returns pre-rendered HTML list (`view`) for direct insertion into checkout UI.

#### Response

```json
{
  "available_shipping_methods": [
    {
      "id": 1,
      "title": "Standard Shipping",
      "charge_type": "flat_rate",
      "charge_amount": 500,
      "status": "active",
      "countries": ["US", "CA"],
      "states": []
    }
  ],
  "country_code": "US"
}
```

---

### 5. Get Country Info

`GET /fluent-cart/v2/checkout/get-country-info`

Retrieve localization details for a country (`data.country_code`, `data.states` array, and localized `data.address_locale` field requirements).

#### Response

```json
{
  "data": {
    "country_code": "US",
    "states": [
      { "label": "California", "value": "CA" },
      { "label": "New York", "value": "NY" }
    ],
    "address_locale": {
      "state": { "label": "State", "required": true },
      "postcode": { "label": "ZIP Code", "required": true },
      "city": { "label": "City", "required": true }
    }
  }
}
```

---

## User Authentication

### Customer Login

`POST /fluent-cart/v2/user/login`

Authenticates WordPress user during checkout and sets authentication cookies.

> **Header Required:** `X-WP-Nonce` header is required to prevent CSRF attacks.

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `user_login` | string | body | Yes | WordPress username or email address |
| `password` | string | body | Yes | Account password |
| `remember_me` | string | body | No | `on` to persist login session |

#### Response

```json
{
  "success": true,
  "data": {
    "message": "Login successful",
    "redirect_url": "https://your-site.com/customer-profile/#/profile"
  }
}
```

#### Example

```http
POST https://example.com/wp-json/fluent-cart/v2/user/login
Content-Type: application/json
X-WP-Nonce: your_nonce_here

{
    "user_login": "john@example.com",
    "password": "securepassword123",
    "remember_me": "on"
}
```
