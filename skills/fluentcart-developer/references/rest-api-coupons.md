# Coupons API

Create and manage discount coupons, apply coupons to orders, and configure coupon settings.

**Base URL:** `https://your-site.com/wp-json/fluent-cart/v2/coupons`

**Policy:** `CouponPolicy`

> All monetary values are in cents (e.g., `$10.00` = `1000`).

---

## Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/coupons/listCoupons` | List Coupon Codes (lightweight array) |
| GET | `/coupons` | List Coupons (Paginated with filters) |
| GET | `/coupons/getSettings` | Get Coupon Settings |
| GET | `/coupons/{id}` | View Coupon Details |
| POST | `/coupons` | Create Coupon |
| PUT | `/coupons/{id}` | Update Coupon |
| DELETE | `/coupons/{id}` | Delete Coupon |
| POST | `/coupons/apply` | Apply Coupon to order items |
| POST | `/coupons/cancel` | Cancel Coupon from order |
| POST | `/coupons/re-apply` | Re-apply Coupons on item change |
| POST | `/coupons/checkProductEligibility` | Check Product Eligibility for coupons |
| POST | `/coupons/storeCouponSettings` | Store Coupon Settings |

---

## List Coupon Codes

`GET /fluent-cart/v2/coupons/listCoupons`

Retrieve a simple array of active coupon codes. This lightweight endpoint is designed for use in order creation forms and quick coupon lookups.

**Permission:** `orders/create` or `orders/manage` or `coupons/view`

### Response

```json
{
  "coupons": [
    "SAVE10",
    "WELCOME20",
    "FREESHIP"
  ]
}
```

*The response returns only the code values of coupons with active status.*

### Example

```bash
curl -X GET "https://example.com/wp-json/fluent-cart/v2/coupons/listCoupons" \
  -u "username:app_password"
```

---

## List Coupons (Paginated)

`GET /fluent-cart/v2/coupons`

Retrieve a paginated list of coupons with optional filtering, sorting, and search. Coupon statuses are automatically updated based on their start/end dates before the response is returned.

**Permission:** `coupons/view`

### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `page` | integer | query | No | Page number for pagination |
| `per_page` | integer | query | No | Number of records per page (1-199, default: 10) |
| `search` | string | query | No | Search by coupon title, code, or ID. If search contains `%`, searches percentage coupons by amount. Numeric values match amount (cents). Supports operator syntax (e.g., `status = active`, `id > 5`) |
| `sort_by` | string | query | No | Column to sort by (default: `id`). Must be a fillable column on Coupon model |
| `sort_type` | string | query | No | Sort direction: `asc` or `desc` (default: `desc`) |
| `active_view` | string | query | No | Tab filter: `active` or `expired` |
| `filter_type` | string | query | No | Filter mode: `simple` (default) or `advanced` |
| `advanced_filters` | string (JSON) | query | No | JSON-encoded array of advanced filter groups (Pro only) |
| `with` | array/string | query | No | Eager-load relations |
| `select` | array/string | query | No | Comma-separated list of columns to select |
| `include_ids` | array/string | query | No | Comma-separated IDs that must always be included |
| `user_tz` | string | query | No | User timezone for date filtering (e.g., `America/New_York`) |

### Active View Filters

| View | Behavior |
|------|----------|
| `active` | Coupons where `status = 'active'` |
| `expired` | Coupons where `end_date` has passed (and is not null/empty), or status != `'active'` |

### Response

```json
{
  "coupons": {
    "total": 25,
    "per_page": 10,
    "current_page": 1,
    "last_page": 3,
    "data": [
      {
        "id": 1,
        "parent": null,
        "title": "10% Off Everything",
        "code": "SAVE10",
        "status": "active",
        "type": "percentage",
        "conditions": {
          "min_purchase_amount": 5000,
          "max_discount_amount": 10000,
          "max_purchase_amount": 0,
          "apply_to_whole_cart": "no",
          "apply_to_quantity": "no",
          "max_uses": 100,
          "max_per_customer": 1,
          "excluded_categories": [],
          "included_categories": [],
          "excluded_products": [],
          "included_products": [],
          "email_restrictions": "",
          "is_recurring": "no"
        },
        "amount": 10,
        "stackable": "yes",
        "priority": 1,
        "use_count": 12,
        "notes": "",
        "show_on_checkout": "yes",
        "start_date": "2025-01-01 00:00:00",
        "end_date": "2025-12-31 23:59:59",
        "created_at": "2025-01-01 10:00:00",
        "updated_at": "2025-06-15 14:30:00",
        "total_items": 12
      }
    ]
  }
}
```

### Example

```bash
curl -X GET "https://example.com/wp-json/fluent-cart/v2/coupons?page=1&per_page=20&search=SAVE&active_view=active" \
  -u "username:app_password"
```

---

## Get Coupon Settings

`GET /fluent-cart/v2/coupons/getSettings`

Retrieve the global coupon settings (currently, whether coupon input is shown on the checkout page).

**Permission:** `coupons/view`

### Response

```json
{
  "show_on_checkout": 1
}
```

### Example

```bash
curl -X GET "https://example.com/wp-json/fluent-cart/v2/coupons/getSettings" \
  -u "username:app_password"
```

---

## View Coupon Details

`GET /fluent-cart/v2/coupons/{id}`

Retrieve detailed information about a specific coupon, including its activity log.

**Permission:** `coupons/view`

### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `id` | integer | path | Yes | The coupon ID |

### Response

```json
{
  "coupon": {
    "id": 1,
    "parent": null,
    "title": "10% Off Everything",
    "code": "SAVE10",
    "status": "active",
    "type": "percentage",
    "conditions": {
      "min_purchase_amount": 5000,
      "max_discount_amount": 10000,
      "max_purchase_amount": 0,
      "apply_to_whole_cart": "no",
      "apply_to_quantity": "no",
      "max_uses": 100,
      "max_per_customer": 1,
      "excluded_categories": [],
      "included_categories": [],
      "excluded_products": [],
      "included_products": [],
      "email_restrictions": "",
      "is_recurring": "no"
    },
    "amount": 10,
    "stackable": "yes",
    "priority": 1,
    "use_count": 12,
    "notes": "Internal note about this coupon",
    "show_on_checkout": "yes",
    "start_date": "2025-01-01 00:00:00",
    "end_date": "2025-12-31 23:59:59",
    "created_at": "2025-01-01 10:00:00",
    "updated_at": "2025-06-15 14:30:00",
    "activities": [
      {
        "id": 1,
        "title": "Coupon Created",
        "content": "Coupon \"SAVE10\" created by Admin",
        "status": "success",
        "user_id": 1,
        "created_at": "2025-01-01 10:00:00",
        "user": {
          "ID": 1,
          "display_name": "Admin"
        }
      }
    ]
  }
}
```

### Example

```bash
curl -X GET "https://example.com/wp-json/fluent-cart/v2/coupons/1" \
  -u "username:app_password"
```

---

## Create Coupon

`POST /fluent-cart/v2/coupons`

Create a new discount coupon.

**Permission:** `coupons/manage`

### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `title` | string | body | Yes | Coupon display name. Max 200 characters. |
| `code` | string | body | Yes | Unique coupon code. Max 50 characters. Must be unique. |
| `type` | string | body | Yes | Discount type: `fixed`, `percentage`, `free_shipping`, `buy_x_get_y` |
| `amount` | number | body | Yes | Discount amount. Percentage: 0-100. Fixed: amount in store currency (auto-converted to cents). |
| `status` | string | body | Yes | Coupon status: `active`, `expired`, `disabled`, `scheduled` |
| `stackable` | string | body | Yes | Combine with others: `yes` or `no`. Max 50 chars. |
| `show_on_checkout` | string | body | Yes | Display on checkout: `yes` or `no`. Max 50 chars. |
| `priority` | integer | body | No | Sort priority for discount calculation order. Min: 0. |
| `notes` | string | body | No | Internal notes about the coupon. |
| `start_date` | string | body | Conditional | Start date. Required if `end_date` provided. Auto-converted to GMT. |
| `end_date` | string | body | No | End date. Must be after `start_date` if provided. Auto-converted to GMT. |
| `conditions` | object | body | No | Coupon conditions and restrictions (see below). |

### Conditions Object

| Field | Type | Description |
|-------|------|-------------|
| `min_purchase_amount` | number | Minimum purchase amount in store currency. Auto-converted to cents. |
| `max_discount_amount` | number | Maximum discount cap in store currency. Auto-converted to cents. |
| `max_purchase_amount` | number | Maximum purchase amount allowed. |
| `apply_to_whole_cart` | string | Apply discount to entire cart (`yes` or `no`). |
| `apply_to_quantity` | string | Apply discount per quantity (`yes` or `no`). |
| `max_uses` | integer | Maximum total uses across all customers (>= `max_per_customer`). |
| `max_per_customer` | integer | Maximum uses per customer. |
| `included_products` | array | Product IDs coupon is limited to. |
| `excluded_products` | array | Product IDs excluded from coupon. |
| `included_categories` | array | Category term IDs coupon is limited to. |
| `excluded_categories` | array | Category term IDs excluded from coupon. |
| `email_restrictions` | string | Email-based restriction. |
| `is_recurring` | string | Applies to subscription renewals (`yes` or `no`). |
| `buy_products` | array | Product IDs for buy part of buy-x-get-y coupons. |
| `get_products` | array | Product IDs for get part of buy-x-get-y coupons. |

### Response

```json
{
  "message": "Coupon created successfully!",
  "data": {
    "id": 5,
    "parent": null,
    "title": "Summer Sale 20%",
    "code": "SUMMER20",
    "status": "active",
    "type": "percentage",
    "conditions": {
      "min_purchase_amount": 2000,
      "max_discount_amount": 5000,
      "max_purchase_amount": 0,
      "apply_to_whole_cart": "yes",
      "apply_to_quantity": "no",
      "max_uses": 500,
      "max_per_customer": 2,
      "excluded_categories": [],
      "included_categories": [],
      "excluded_products": [],
      "included_products": [],
      "email_restrictions": "",
      "is_recurring": "no"
    },
    "amount": 20,
    "stackable": "yes",
    "priority": 1,
    "use_count": 0,
    "notes": "",
    "show_on_checkout": "yes",
    "start_date": "2025-06-01 00:00:00",
    "end_date": "2025-08-31 23:59:59",
    "created_at": "2025-05-25 10:00:00",
    "updated_at": "2025-05-25 10:00:00"
  }
}
```

### Example

```bash
curl -X POST "https://example.com/wp-json/fluent-cart/v2/coupons" \
  -u "username:app_password" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Summer Sale 20%",
    "code": "SUMMER20",
    "type": "percentage",
    "amount": 20,
    "status": "active",
    "stackable": "yes",
    "show_on_checkout": "yes",
    "priority": 1,
    "start_date": "2025-06-01 00:00:00",
    "end_date": "2025-08-31 23:59:59",
    "conditions": {
      "min_purchase_amount": 20.00,
      "max_discount_amount": 50.00,
      "max_uses": 500,
      "max_per_customer": 2,
      "apply_to_whole_cart": "yes",
      "is_recurring": "no"
    }
  }'
```

---

## Update Coupon

`PUT /fluent-cart/v2/coupons/{id}`

Update an existing coupon. Accepts the same fields as Create Coupon.

**Permission:** `coupons/manage`

### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `id` | integer | path | Yes | The coupon ID |

### Response

```json
{
  "message": "Coupon updated successfully!",
  "data": {
    "id": 5,
    "title": "Summer Sale 25%",
    "code": "SUMMER25",
    "status": "active",
    "type": "percentage",
    "amount": 25,
    "conditions": { ... },
    "stackable": "yes",
    "priority": 1,
    "use_count": 12,
    "notes": "",
    "show_on_checkout": "yes",
    "start_date": "2025-06-01 00:00:00",
    "end_date": "2025-08-31 23:59:59",
    "created_at": "2025-05-25 10:00:00",
    "updated_at": "2025-06-20 11:00:00"
  }
}
```

### Example

```bash
curl -X PUT "https://example.com/wp-json/fluent-cart/v2/coupons/5" \
  -u "username:app_password" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Summer Sale 25%",
    "code": "SUMMER25",
    "type": "percentage",
    "amount": 25,
    "status": "active",
    "stackable": "yes",
    "show_on_checkout": "yes"
  }'
```

---

## Delete Coupon

`DELETE /fluent-cart/v2/coupons/{id}`

Permanently delete a coupon.

**Permission:** `coupons/delete`

### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `id` | integer | path/body | Yes | The coupon ID |

### Response

```json
{
  "message": "Coupon successfully deleted.",
  "data": ""
}
```

### Example

```bash
curl -X DELETE "https://example.com/wp-json/fluent-cart/v2/coupons/5" \
  -u "username:app_password"
```

---

## Apply Coupon

`POST /fluent-cart/v2/coupons/apply`

Apply a coupon code to a set of order line items and return recalculated discount breakdown.

**Permission:** `orders/create` or `orders/manage`

### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `coupon_code` | string | body | Yes | The coupon code to apply |
| `order_items` | array | body | Yes | Array of order line item objects |
| `order_uuid` | string | body | No | UUID of an existing order to apply coupon to |
| `applied_coupons` | array | body | No | Array of coupon IDs already applied |
| `customer_email` | string | body | No | Customer email for restrictions |

### Response

```json
{
  "applied_coupons": {
    "SAVE10": {
      "id": 1,
      "title": "10% Off",
      "code": "SAVE10",
      "type": "percentage",
      "amount": 10,
      "discount_amount": 500,
      "stackable": "yes",
      "priority": 1
    }
  },
  "calculated_items": [
    {
      "post_id": 42,
      "quantity": 2,
      "price": 2500,
      "discounted_price": 2250,
      "discount_total": 500
    }
  ]
}
```

### Example

```bash
curl -X POST "https://example.com/wp-json/fluent-cart/v2/coupons/apply" \
  -u "username:app_password" \
  -H "Content-Type: application/json" \
  -d '{
    "coupon_code": "SAVE10",
    "order_items": [
      {
        "post_id": 42,
        "quantity": 2,
        "price": 2500,
        "unit_price": 2500,
        "item_total": 5000,
        "line_total": 5000,
        "other_info": {
          "payment_type": "onetime"
        }
      }
    ],
    "applied_coupons": []
  }'
```

---

## Cancel Coupon

`POST /fluent-cart/v2/coupons/cancel`

Remove a coupon from an order and recalculate remaining discounts.

**Permission:** `orders/create` or `orders/manage`

### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `coupon_code` | string | body | Yes | Coupon code to cancel |
| `order_items` | array | body | Yes | Array of current order line item objects |
| `id` | integer | body | No | Applied coupon record ID (from `fct_applied_coupons`) |
| `order_uuid` | string | body | No | UUID of existing order |
| `applied_coupons` | array | body | No | Array of remaining coupon IDs |
| `customer_email` | string | body | No | Customer email address |

### Response

```json
{
  "applied_coupons": {
    "WELCOME5": {
      "id": 2,
      "title": "Welcome $5 Off",
      "code": "WELCOME5",
      "type": "fixed",
      "amount": 500,
      "discount_amount": 500,
      "stackable": "yes",
      "priority": 2
    }
  },
  "calculated_items": [
    {
      "post_id": 42,
      "quantity": 2,
      "price": 2500,
      "discounted_price": 2250,
      "discount_total": 500
    }
  ]
}
```

### Example

```bash
curl -X POST "https://example.com/wp-json/fluent-cart/v2/coupons/cancel" \
  -u "username:app_password" \
  -H "Content-Type: application/json" \
  -d '{
    "coupon_code": "SAVE10",
    "id": 15,
    "order_uuid": "abc123-def456",
    "order_items": [
      {
        "post_id": 42,
        "quantity": 2,
        "price": 2500,
        "unit_price": 2500,
        "item_total": 5000,
        "line_total": 5000
      }
    ],
    "applied_coupons": [2]
  }'
```

---

## Re-apply Coupons

`POST /fluent-cart/v2/coupons/re-apply`

Recalculate all previously applied coupons against current order items.

**Permission:** `orders/create` or `orders/manage`

### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `order_uuid` | string | body | No | UUID of existing order |
| `order_items` | array | body | No | Array of current order line item objects |
| `applied_coupons` | array | body | No | Array of coupon IDs to include |

### Response

```json
{
  "applied_coupons": {
    "SAVE10": {
      "id": 1,
      "title": "10% Off",
      "code": "SAVE10",
      "type": "percentage",
      "amount": 10,
      "discount_amount": 450,
      "stackable": "yes",
      "priority": 1
    }
  },
  "calculated_items": [
    {
      "post_id": 42,
      "quantity": 1,
      "price": 2500,
      "discounted_price": 2250,
      "discount_total": 250
    }
  ]
}
```

### Example

```bash
curl -X POST "https://example.com/wp-json/fluent-cart/v2/coupons/re-apply" \
  -u "username:app_password" \
  -H "Content-Type: application/json" \
  -d '{
    "order_uuid": "abc123-def456",
    "order_items": [
      {
        "post_id": 42,
        "quantity": 1,
        "price": 2500,
        "unit_price": 2500,
        "item_total": 2500,
        "line_total": 2500
      }
    ],
    "applied_coupons": [1]
  }'
```

---

## Check Product Eligibility

`POST /fluent-cart/v2/coupons/checkProductEligibility`

Check whether a product is eligible for a set of applied coupons.

**Permission:** `orders/create` or `orders/manage`

### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `productId` | integer | body | Yes | Product (post) ID to check |
| `appliedCoupons` | array | body | No | Array of coupon codes currently applied |
| `origin` | string | body | No | Context origin (e.g., `checkout`) |

### Response

Eligible:
```json
{
  "isApplicable": true
}
```

Not Eligible:
```json
{
  "isApplicable": false,
  "message": "Product A conflicts with SAVE10 coupon. Remove the coupon first."
}
```

### Example

```bash
curl -X POST "https://example.com/wp-json/fluent-cart/v2/coupons/checkProductEligibility" \
  -u "username:app_password" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 42,
    "appliedCoupons": ["SAVE10", "WELCOME5"],
    "origin": "admin_order"
  }'
```

---

## Store Coupon Settings

`POST /fluent-cart/v2/coupons/storeCouponSettings`

Update the global coupon settings.

**Permission:** `coupons/manage`

### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `show_on_checkout` | boolean | body | No | Whether to show coupon input on checkout page |

### Response

```json
true
```

### Example

```bash
curl -X POST "https://example.com/wp-json/fluent-cart/v2/coupons/storeCouponSettings" \
  -u "username:app_password" \
  -H "Content-Type: application/json" \
  -d '{
    "show_on_checkout": true
  }'
```

---

## Coupon Model & Database Reference

### Coupon Types

| Type | Description | Amount Handling |
|------|-------------|-----------------|
| `fixed` | Fixed amount discount | Stored in cents (e.g., 1000 = $10.00) |
| `percentage` | Percentage discount | Stored as percentage (e.g., 10 = 10%). Max: 100 |
| `free_shipping` | Free shipping coupon | Amount is typically 0 |
| `buy_x_get_y` | Buy X Get Y promotion | Uses `conditions.buy_products` & `conditions.get_products` |

### Database Table (`fct_coupons`)

| Column | Type | Description |
|--------|------|-------------|
| `id` | BIGINT (PK) | Auto-increment ID |
| `parent` | BIGINT | Parent coupon ID |
| `title` | VARCHAR(200) | Display name |
| `code` | VARCHAR(50) | Unique coupon code |
| `status` | VARCHAR(20) | Coupon status (`active`, `expired`, `disabled`, `scheduled`) |
| `type` | VARCHAR(20) | Discount type |
| `conditions` | TEXT (JSON) | JSON-encoded conditions object |
| `amount` | BIGINT | Discount amount (cents or percentage) |
| `stackable` | VARCHAR(10) | Stackability flag (`yes`/`no`) |
| `priority` | INT | Sort priority |
| `use_count` | INT | Usage count |
| `notes` | TEXT | Internal notes |
| `show_on_checkout` | VARCHAR(10) | Display on checkout flag |
| `start_date` | DATETIME | Start date (GMT) |
| `end_date` | DATETIME | End date (GMT) |
| `created_at` | DATETIME | Creation timestamp |
| `updated_at` | DATETIME | Last update timestamp |

### Hooks

- `fluent_cart/coupon_created` — Action fired after coupon creation.
- `fluent_cart/coupon_updated` — Action fired after coupon update.
- `fluent_cart/coupons_list_filter_query` — Filter to modify coupon list query.
