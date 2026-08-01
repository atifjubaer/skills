# Settings API

Configure store settings, payment gateways, feature modules, file storage drivers, checkout fields, permissions, confirmation pages, and PayPal onboarding in FluentCart.

**Base URL:** `https://your-site.com/wp-json/fluent-cart/v2/settings`  
**Policy:** `StoreSettingsPolicy` (most endpoints require `is_super_admin` or `store/settings`) / `StoreSensitivePolicy` (for checkout fields)

---

## Endpoints Overview

| Group | Method | Endpoint | Permission / Policy | Description |
|-------|--------|----------|--------------------|-------------|
| **Payment Methods** | GET | `/settings/payment-methods` | `is_super_admin` | Retrieve gateway configuration (Stripe, PayPal, etc.) |
| | POST | `/settings/payment-methods` | `is_super_admin` | Create/update gateway configuration |
| | GET | `/settings/payment-methods/all` | `is_super_admin` | List all registered payment method gateways |
| | POST | `/settings/payment-methods/reorder` | `is_super_admin` | Set display order of payment methods at checkout |
| | GET | `/settings/payment-methods/connect/info` | `is_super_admin` | Retrieve OAuth / connect info for gateway |
| | POST | `/settings/payment-methods/disconnect` | `is_super_admin` | Disconnect gateway account (test/live mode) |
| | POST | `/settings/payment-methods/design` | `is_super_admin` | Save checkout label, logo, & instructions |
| | POST | `/settings/payment-methods/install-addon` | `is_super_admin` | Install payment gateway addon plugin |
| | POST | `/settings/payment-methods/activate-addon` | `is_super_admin` | Activate payment gateway addon plugin |
| **PayPal Config** | POST | `/settings/payment-methods/paypal/seller-auth-token` | `super_admin` | Exchange PayPal OAuth code for seller token |
| | POST | `/settings/payment-methods/paypal/webhook/setup` | `super_admin` | Register PayPal payment webhook |
| | GET | `/settings/payment-methods/paypal/webhook/check` | `super_admin` | Verify PayPal webhook registration status |
| **Permissions** | GET | `/settings/permissions` | `is_super_admin` | Retrieve role-to-capability permission mappings |
| | POST | `/settings/permissions` | `is_super_admin` | Update role-to-capability permission mappings |
| **Store Settings** | GET | `/settings/store` | `store/settings` | Retrieve store configuration & field schema |
| | POST | `/settings/store` | `store/settings` (`FluentMetaRequest`) | Update store configuration settings |
| **Modules** | GET | `/settings/modules/plugin-addons` | `is_super_admin` | List registered plugin addons (Elementor, etc.) |
| | POST | `/settings/modules/plugin-addons/install` | `is_super_admin` | Install plugin addon |
| | POST | `/settings/modules/plugin-addons/activate` | `is_super_admin` | Activate plugin addon |
| | GET | `/settings/modules` | `is_super_admin` | List feature toggles & field schema |
| | POST | `/settings/modules` | `is_super_admin` | Enable/disable modules & update settings |
| **Confirmation** | POST | `/settings/confirmation` | `is_super_admin` | Update receipt/confirmation page settings |
| | GET | `/settings/confirmation/shortcode` | `is_super_admin` | Get available shortcodes / merge tags |
| **Storage Drivers** | GET | `/settings/storage-drivers` | `is_super_admin` | List all file storage drivers (Local, S3, CDN) |
| | POST | `/settings/storage-drivers` | `is_super_admin` | Save storage driver configuration |
| | GET | `/settings/storage-drivers/active-drivers` | `is_super_admin` | List active/enabled storage drivers |
| | GET | `/settings/storage-drivers/{driver}` | `is_super_admin` | Get configuration for specific driver |
| | POST | `/settings/storage-drivers/verify-info` | `is_super_admin` | Test storage driver credentials connection |
| **Checkout Fields** | GET | `/checkout-fields/get-fields` | `store/sensitive` | Get checkout field schema & settings |
| | POST | `/checkout-fields/save-fields` | `store/sensitive` | Update checkout field visibility & required rules |

---

## Payment Methods

Configure payment gateways (Stripe, PayPal, Cash on Delivery, etc.), gateway reordering, designs, and addon plugins.

**Prefix:** `/fluent-cart/v2/settings/payment-methods` | **Permission:** `is_super_admin`

### Get Payment Method Settings

`GET /fluent-cart/v2/settings/payment-methods`

Retrieve configuration settings for a specific payment method.

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `method` | string | query | Yes | Payment method key (e.g., `stripe`, `paypal`, `cod`) |

#### Response

```json
{
  "settings": {
    "is_active": "yes",
    "payment_mode": "live",
    "checkout_label": "Pay with Stripe",
    "checkout_logo": "https://example.com/stripe-logo.png",
    "checkout_instructions": "",
    "thank_you_page_instructions": ""
  },
  "fields": {}
}
```

#### Example

```bash
curl -X GET "https://example.com/wp-json/fluent-cart/v2/settings/payment-methods?method=stripe" \
  -u "username:app_password"
```

---

### Save Payment Method Settings

`POST /fluent-cart/v2/settings/payment-methods`

Create or update gateway configuration.

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `method` | string | body | Yes | Payment method key (e.g., `stripe`, `paypal`, `cod`) |
| `settings` | object | body | Yes | Key-value object of gateway-specific settings to save |

#### Request Example

```json
{
  "method": "cod",
  "settings": {
    "is_active": "yes",
    "checkout_label": "Cash on Delivery"
  }
}
```

#### Response

```json
{
  "settings": {
    "is_active": "yes",
    "checkout_label": "Cash on Delivery"
  },
  "message": "Settings saved successfully"
}
```

---

### List All Payment Methods

`GET /fluent-cart/v2/settings/payment-methods/all`

Retrieve all registered payment method gateways categorized by availability status (available first, then Pro required, then upcoming).

#### Response

```json
{
  "gateways": [
    {
      "method_key": "stripe",
      "title": "Stripe",
      "is_active": "yes",
      "description": "Accept payments via Stripe",
      "logo": "https://...",
      "upcoming": false
    },
    {
      "method_key": "paypal",
      "title": "PayPal",
      "is_active": "no",
      "requires_pro": true
    }
  ]
}
```

---

### Reorder Payment Methods

`POST /fluent-cart/v2/settings/payment-methods/reorder`

Set the display order of payment methods on the checkout page.

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `order` | array | body | Yes | Ordered array of payment method keys (e.g. `["stripe", "paypal", "cod"]`) |

#### Request Example

```json
{
  "order": ["stripe", "paypal", "cod"]
}
```

#### Response

```json
{
  "message": "Payment methods order saved successfully",
  "order": ["stripe", "paypal", "cod"]
}
```

---

### Get Payment Method Connection Info

`GET /fluent-cart/v2/settings/payment-methods/connect/info`

Retrieve connection info (OAuth URLs, account status) for OAuth-based payment gateways (Stripe Connect, PayPal Connect).

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `method` | string | query | Yes | Payment method key (e.g. `stripe`, `paypal`) |

#### Response

```json
{
  "connect_config": {
    "test_redirect": "https://example.com/wp-admin/?fluent-cart=...",
    "live_redirect": "https://example.com/wp-admin/?fluent-cart=...",
    "disconnect_note": "Disconnecting will prevent..."
  },
  "test_account": {},
  "live_account": {},
  "settings": {}
}
```

---

### Disconnect Payment Method

`POST /fluent-cart/v2/settings/payment-methods/disconnect`

Disconnect a connected gateway account.

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `method` | string | body | Yes | Payment method key (e.g., `stripe`, `paypal`) |
| `mode` | string | body | Yes | Environment mode: `test` or `live` |

#### Response

```json
{
  "message": "PayPal settings has been disconnected",
  "settings": {}
}
```

---

### Save Payment Method Design

`POST /fluent-cart/v2/settings/payment-methods/design`

Customize checkout label, logo, and instructions for a gateway.

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `method` | string | body | Yes | Payment method key |
| `checkout_label` | string | body | No | Custom label displayed on checkout form |
| `checkout_logo` | string | body | No | URL to custom logo image |
| `checkout_instructions` | string | body | No | HTML instructions shown on checkout form when selected |
| `thank_you_page_instructions` | string | body | No | HTML instructions shown on thank-you receipt page |

---

### Install & Activate Payment Addons

- `POST /fluent-cart/v2/settings/payment-methods/install-addon` — Install gateway addon (`plugin_slug`, `source_type`: `wordpress` | `github`, `source_link`).
- `POST /fluent-cart/v2/settings/payment-methods/activate-addon` — Activate installed gateway addon (`plugin_file`: `fluent-cart-pro/fluent-cart-pro.php`).

---

## PayPal Configuration

Endpoints for PayPal Connect OAuth onboarding and webhook registration.

**Policy:** `AdminPolicy` | **Permission:** `super_admin`

- `POST /fluent-cart/v2/settings/payment-methods/paypal/seller-auth-token` — Exchange OAuth auth code (`authCode`, `sharedId`, `mode`: `test` | `live`). Saves credentials & auto-registers webhooks.
- `POST /fluent-cart/v2/settings/payment-methods/paypal/webhook/setup` — Register webhook endpoint with PayPal (`mode`).
- `GET /fluent-cart/v2/settings/payment-methods/paypal/webhook/check` — Verify PayPal webhook status (`mode`).

---

## Permissions

Manage role-to-capability permission assignments for FluentCart administrative access.

**Prefix:** `/fluent-cart/v2/settings/permissions` | **Permission:** `is_super_admin`

### Get Permissions

`GET /fluent-cart/v2/settings/permissions`

#### Response

```json
{
  "roles": {
    "administrator": {
      "name": "Administrator",
      "capabilities": {
        "orders/view": true,
        "orders/manage": true,
        "customers/view": true,
        "products/manage": true
      }
    },
    "shop_manager": {
      "name": "Shop Manager",
      "capabilities": {}
    }
  }
}
```

---

### Save Permissions

`POST /fluent-cart/v2/settings/permissions`

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `capability` | object | body | Yes | Object mapping WordPress role slugs to capability assignments |

#### Request Example

```json
{
  "capability": {
    "shop_manager": {
      "orders/view": true,
      "orders/manage": true,
      "customers/view": true,
      "products/manage": false
    }
  }
}
```

#### Response

```json
{
  "message": "Permissions saved successfully"
}
```

---

## Store Settings

Manage global store configuration (currency, store details, pages, button labels, checkout style, invoice prefixes, themes).

**Prefix:** `/fluent-cart/v2/settings/store` | **Policy:** `StoreSettingsPolicy` (`store/settings`)

### Get Store Settings

`GET /fluent-cart/v2/settings/store`

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `settings_name` | string | query | No | Settings tab identifier (e.g. `store_setup`, `checkout`, `pages`) |

---

### Save Store Settings

`POST /fluent-cart/v2/settings/store`

**Request Class:** `FluentMetaRequest` (validates input parameters)

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `settings_name` | string | body | Conditional | Tab identifier (`store_setup` enforces `store_name` & `store_country`) |
| `store_name` | string | body | Conditional | Store name (max 200 chars). Required when `settings_name` is `store_setup` |
| `store_country` | string | body | Conditional | ISO country code. Required when `settings_name` is `store_setup` |
| `store_logo` | object | body | No | Store logo (`id`, `url`, `title`) |
| `currency` | string | body | No | Store currency code (e.g., `USD`, `EUR`, `GBP`) |
| `currency_position` | string | body | No | Symbol position: `before` or `after` |
| `decimal_separator` | string | body | No | Decimal separator: `dot` or `comma` |
| `checkout_button_text` | string | body | No | Custom text for checkout button |
| `view_cart_button_text` | string | body | No | Custom text for view cart button |
| `cart_button_text` | string | body | No | Custom text for add-to-cart button |
| `popup_button_text` | string | body | No | Custom text for product popup button |
| `out_of_stock_button_text` | string | body | No | Custom text for out-of-stock button |
| `checkout_method_style` | string | body | No | Payment method display on checkout (`logo` or other) |
| `enable_modal_checkout` | string | body | No | Enable modal checkout: `yes` or `no` |
| `show_cart_icon_in_nav` | string | body | No | Show cart icon in navigation: `yes` or `no` |
| `show_cart_icon_in_body` | string | body | No | Show floating cart icon: `yes` or `no` |
| `additional_address_field` | string | body | No | Show additional address field: `yes` or `no` |
| `hide_coupon_field` | string | body | No | Hide coupon input on checkout: `yes` or `no` |
| `user_account_creation_mode` | string | body | No | Account creation mode: `all`, `optional`, or `disabled` |
| `force_ssl` | string | body | No | Force SSL on checkout: `yes` or `no` |
| `checkout_page_id` | integer | body | No | WP page ID for checkout |
| `cart_page_id` | integer | body | No | WP page ID for cart |
| `receipt_page_id` | integer | body | No | WP page ID for receipt |
| `shop_page_id` | integer | body | No | WP page ID for shop |
| `customer_profile_page_id` | integer | body | No | WP page ID for customer profile |
| `customer_profile_page_slug` | string | body | No | Custom slug for customer profile page |
| `registration_page_id` | integer | body | No | WP page ID for registration |
| `login_page_id` | integer | body | No | WP page ID for login |
| `store_address1` | string | body | No | Store address line 1 |
| `store_address2` | string | body | No | Store address line 2 |
| `store_city` | string | body | No | Store city |
| `store_postcode` | string | body | No | Store zip/postal code |
| `store_state` | string | body | No | Store state/province code |
| `order_mode` | string | body | No | Order/payment mode: `test` or `live` |
| `variation_view` | string | body | No | Product variation display: `both`, `grid`, `list` |
| `variation_columns` | string | body | No | Variation layout: `masonry` or standard |
| `enable_early_payment_for_installment` | string | body | No | Allow early installment payments: `yes` or `no` |
| `product_slug` | string | body | No | Custom product URL slug |
| `min_receipt_number` | string | body | No | Minimum receipt number |
| `inv_prefix` | string | body | No | Invoice number prefix (e.g. `INV-`) |
| `frontend_theme` | object | body | No | Theme color overrides object (hex values) |

#### Example

```bash
curl -X POST "https://example.com/wp-json/fluent-cart/v2/settings/store" \
  -u "username:app_password" \
  -H "Content-Type: application/json" \
  -d '{
    "settings_name": "store_setup",
    "store_name": "My Awesome Store",
    "store_country": "US",
    "currency": "USD",
    "order_mode": "live"
  }'
```

---

## Feature Modules & Addons

Enable/disable core modules (shipping, tax, coupons, subscriptions) and manage plugin addons (e.g. Elementor Blocks).

**Prefix:** `/fluent-cart/v2/settings/modules` | **Permission:** `is_super_admin`

- `GET /settings/modules/plugin-addons` — Get list of registered plugin addons.
- `POST /settings/modules/plugin-addons/install` — Install plugin addon (`plugin_slug`, `source_type`: `wordpress` | `github` | `cdn`, `source_link`, `asset_path`).
- `POST /settings/modules/plugin-addons/activate` — Activate plugin addon (`plugin_file`).
- `GET /settings/modules` — Retrieve all module feature toggles & field schemas (filtered via `fluent_cart/module_setting/fields`).
- `POST /settings/modules` — Enable or disable modules. Fires `fluent_cart/module/activated/{key}` or `fluent_cart/module/deactivated/{key}` action hooks.

---

## Confirmation Pages & Shortcodes

Configure receipt page behavior and view merge tags for emails/confirmations.

- `POST /fluent-cart/v2/settings/confirmation` — Update receipt page configuration (`settings.confirmation_type`: `same_page` | `custom_page`, `message_to_show` [sanitized via `wp_kses_post`], `confirmation_page_id`).
- `GET /fluent-cart/v2/settings/confirmation/shortcode` — List available email & confirmation merge tags (`{{order.id}}`, `{{order.total}}`, `{{customer.email}}`, `{{store.name}}`).

---

## Storage Drivers

Configure file storage providers for digital product downloads (Local server, Amazon S3, Bunny CDN, Cloudflare R2).

**Prefix:** `/fluent-cart/v2/settings/storage-drivers` | **Permission:** `is_super_admin`

- `GET /settings/storage-drivers` — List all registered storage drivers.
- `POST /settings/storage-drivers` — Save storage driver settings (`driver`, `settings`).
- `GET /settings/storage-drivers/active-drivers` — List active/enabled storage drivers.
- `GET /settings/storage-drivers/{driver}` — Get settings & schema for specific driver.
- `POST /settings/storage-drivers/verify-info` — Test credentials connection to storage provider without saving.

---

## Checkout Fields

Manage checkout form field visibility and required rules.

**Base URL:** `https://your-site.com/wp-json/fluent-cart/v2/checkout-fields`  
**Policy:** `StoreSensitivePolicy` (`store/sensitive`)

### Get Checkout Fields

`GET /fluent-cart/v2/checkout-fields/get-fields`

Retrieve field schema and current settings for basic info, billing address, and shipping address.

---

### Save Checkout Fields

`POST /fluent-cart/v2/checkout-fields/save-fields`

Update checkout field visibility and required flags.

> **Automatic Field Logic Rules Enforced:**
> - If `first_name` or `last_name` is enabled, `full_name` is automatically disabled.
> - If neither `first_name` nor `last_name` is enabled, `full_name` is automatically enabled and forced to required.
> - If `first_name` is enabled, it is forced to required. Same for `last_name`.

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `settings` | object | body | Yes | Field settings object (`basic_info`, `billing_address`, `shipping_address`) |
| `settings.basic_info.{field}.enabled` | string | body | No | Show field: `yes` or `no` |
| `settings.basic_info.{field}.required` | string | body | No | Require field: `yes` or `no` |

#### Request Example

```json
{
  "settings": {
    "basic_info": {
      "full_name": { "enabled": "no", "required": "no" },
      "first_name": { "enabled": "yes", "required": "yes" },
      "last_name": { "enabled": "yes", "required": "no" }
    }
  }
}
```

#### Response

```json
{
  "message": "Checkout fields has been updated successfully."
}
```
