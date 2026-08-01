# Order Bumps API (Pro)

Create and manage checkout order bump promotions in FluentCart Pro to offer relevant add-ons or discounted upsell products directly on the checkout form.

**Base URL:** `https://your-site.com/wp-json/fluent-cart/v2/order_bump`  
**Policy:** `OrderBumpPolicy` | **Permission:** `store/sensitive` (Requires FluentCart Pro)

> All monetary values (e.g., fixed discount amounts, product prices) are in integer **cents** (`$10.00` = `1000`).

---

## Endpoints Overview

| Method | Endpoint | Permission | Description |
|--------|----------|------------|-------------|
| GET | `/order_bump` | `store/sensitive` | List order bumps with tab filters (`active`, `draft`) |
| POST | `/order_bump` | `store/sensitive` | Create a new order bump offer (minimal initial payload) |
| GET | `/order_bump/{id}` | `store/sensitive` | Retrieve order bump details, config, & product variant |
| PUT | `/order_bump/{id}` | `store/sensitive` | Update configuration, conditions, status, & priority |
| DELETE | `/order_bump/{id}` | `store/sensitive` | Permanently delete an order bump promotion |

---

## Endpoints Specification

### 1. List Order Bumps

`GET /fluent-cart/v2/order_bump`

Retrieve a paginated list of order bumps. Each entry eagerly loads its associated `product_variant` and parent `product`.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `active_view` | string | No | Filter by tab: `active` or `draft` |
| `search` | string | No | Partial title or description search |
| `sort_by` | string | No | Sort column (default: `id`) |
| `sort_type` | string | No | `asc` or `desc` (default: `desc`) |
| `page` | integer | No | Page number |
| `per_page` | integer | No | Items per page |

#### Response

```json
{
  "order_bumps": {
    "total": 5,
    "per_page": 15,
    "current_page": 1,
    "last_page": 1,
    "data": [
      {
        "id": 1,
        "hash": "a1b2c3d4e5f6...",
        "type": "order_bump",
        "status": "active",
        "src_object_id": 42,
        "title": "Add Extended Warranty",
        "description": "<p>Protect your purchase with our 2-year warranty plan.</p>",
        "conditions": [],
        "config": {
          "discount": {
            "discount_type": "percentage",
            "discount_amount": 10
          },
          "display_conditions_if": "",
          "call_to_action": "Yes, add warranty!"
        },
        "priority": 1,
        "product_variant": {
          "id": 42,
          "product_id": 10,
          "title": "Extended Warranty - 2 Year",
          "price": 2999,
          "product": { "id": 10, "title": "Extended Warranty", "status": "publish" }
        }
      }
    ]
  }
}
```

---

### 2. Create Order Bump

`POST /fluent-cart/v2/order_bump`

Creates an order bump with initial title and product variation ID.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | string | Yes | Display title for the order bump |
| `src_object_id` | integer | Yes | Product variation ID offered in the bump |

> **Auto-Generated Defaults:** Creates with `type: "order_bump"`, unique MD5 `hash`, empty `conditions: []`, and empty `config: {}`.

#### Response

```json
{
  "message": "Order bump created successfully",
  "id": 5
}
```

---

### 3. Get Single Order Bump

`GET /fluent-cart/v2/order_bump/{id}`

Returns the order bump configuration and its linked product variant.

#### Default Config Fallback

If no custom config has been saved yet, returns:

```json
{
  "discount": {
    "discount_type": "percentage",
    "discount_amount": 0
  },
  "display_conditions_if": "",
  "call_to_action": ""
}
```

---

### 4. Update Order Bump

`PUT /fluent-cart/v2/order_bump/{id}`

Update configuration, display conditions, status, and sort priority.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | string | Yes | Display title (max 194 chars) |
| `src_object_id` | integer | Yes | Product variation ID for the bump offer |
| `status` | string | No | `active` or `draft` (max 50 chars) |
| `src_object_type` | string | No | Source object type slug (max 50 chars) |
| `description` | string | No | HTML offer description (sanitized with `wp_kses_post`) |
| `config` | object | No | Configuration object (see structure below) |
| `conditions` | array | No | Display rule objects array |
| `priority` | integer | No | Display order (lower numbers display first, min `1`) |

#### Config Object Structure

```json
{
  "config": {
    "discount": {
      "discount_type": "percentage",
      "discount_amount": 10
    },
    "display_conditions_if": "all",
    "call_to_action": "Yes, add 2-year warranty to my order!"
  }
}
```

> **Discount Types:**  
> - `percentage`: `discount_amount` is a number from `0` to `100`.  
> - `fixed`: `discount_amount` is specified in **cents** (e.g. `500` = `$5.00`).

---

### 5. Delete Order Bump

`DELETE /fluent-cart/v2/order_bump/{id}`

---

## Data Model & Database Schema

Order bumps are stored in the `fct_order_promotions` table filtered by `type = 'order_bump'`.

| Column | Data Type | Description |
|--------|-----------|-------------|
| `id` | BIGINT (PK) | Auto-increment primary key |
| `hash` | VARCHAR | Auto-generated unique MD5 hash |
| `parent_id` | BIGINT | Parent promotion ID (nullable) |
| `type` | VARCHAR | Always `order_bump` |
| `status` | VARCHAR | `active` or `draft` |
| `src_object_id` | BIGINT | Product variation ID (`fct_product_variations.id`) |
| `src_object_type` | VARCHAR | Identifier type |
| `title` | VARCHAR | Display title |
| `description` | TEXT | HTML description |
| `conditions` | TEXT (JSON) | JSON array of display rule conditions |
| `config` | TEXT (JSON) | JSON object containing discount & CTA text |
| `priority` | INT | Sort ordering index |
| `created_at` | DATETIME | GMT creation timestamp |
| `updated_at` | DATETIME | GMT update timestamp |
