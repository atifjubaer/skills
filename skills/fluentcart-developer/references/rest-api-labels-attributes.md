# Labels & Attributes API

Manage organizational labels for orders and customers, and product attribute groups and terms used for variation options in FluentCart.

**Base URL:** `https://your-site.com/wp-json/fluent-cart/v2`  
**Policies:** `LabelPolicy` (Labels) / `ProductPolicy` (Attributes)

---

## Endpoints Overview

| Group | Method | Endpoint | Permission / Policy | Request Class | Description |
|-------|--------|----------|--------------------|---------------|-------------|
| **Labels** | GET | `/labels` | `labels/view` | — | Retrieve all labels |
| | POST | `/labels` | `labels/manage` | `LabelRequest` | Create label and optionally bind to entity |
| | POST | `/labels/update-label-selections` | `labels/manage` | — | Sync label selection for order/customer |
| **Attribute Groups** | GET | `/options/attr/groups` | `products/view` | — | List attribute groups (Color, Size, etc.) |
| | POST | `/options/attr/group` | `products/create` | `AttrGroupRequest` | Create attribute group |
| | GET | `/options/attr/group/{group_id}` | `products/view` | — | Get single attribute group (with terms) |
| | PUT | `/options/attr/group/{group_id}` | `products/edit` | `AttrGroupRequest` | Update attribute group |
| | DELETE | `/options/attr/group/{group_id}` | `products/delete` | — | Delete attribute group (guarded if in use) |
| **Attribute Terms** | GET | `/options/attr/group/{id}/terms` | `products/view` | — | List terms within attribute group |
| | POST | `/options/attr/group/{id}/term` | `products/create` | `AttrTermRequest` | Create term within attribute group |
| | POST | `/options/attr/group/{id}/term/{term_id}` | `products/edit` | `AttrTermRequest` | Update attribute term |
| | DELETE | `/options/attr/group/{id}/term/{term_id}` | `products/delete` | — | Delete attribute term (guarded if in use) |
| | POST | `/options/attr/group/{id}/term/{term_id}/serial` | `products/edit` | — | Shift term position (`up` or `down`) |

---

## Labels

Labels are tags that attach to orders, customers, or other entities via a polymorphic relationship for organizational filtering.

**Prefix:** `/fluent-cart/v2/labels` | **Policy:** `LabelPolicy`

### List Labels

`GET /fluent-cart/v2/labels`

#### Permission

`labels/view`

#### Response

```json
{
  "labels": {
    "labels": [
      { "id": 1, "value": "VIP" },
      { "id": 2, "value": "Wholesale" },
      { "id": 3, "value": "Priority" }
    ]
  }
}
```

---

### Create Label

`POST /fluent-cart/v2/labels`

Create a new label and optionally attach it to an entity (`Order`, `Customer`).

#### Permission

`labels/manage` | **Request Class:** `LabelRequest`

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `value` | string | body | Yes | Label name. Must be unique across `fct_label` table |
| `bind_to_type` | string | body | No | Model class to attach (e.g. `Order`, `Customer`) |
| `bind_to_id` | string | body | Conditional | Entity ID (required if `bind_to_type` is provided) |

#### Response

```json
{
  "data": {
    "id": 4,
    "value": "Returning Customer"
  },
  "message": "Label created successfully!"
}
```

#### Example

```bash
curl -X POST "https://example.com/wp-json/fluent-cart/v2/labels" \
  -u "username:app_password" \
  -H "Content-Type: application/json" \
  -d '{
    "value": "Returning Customer",
    "bind_to_type": "Order",
    "bind_to_id": "42"
  }'
```

---

### Update Label Selections

`POST /fluent-cart/v2/labels/update-label-selections`

Sync attached labels for a target entity. Labels in `selectedLabels` are attached; omitted previously attached labels are detached.

#### Permission

`labels/manage`

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `bind_to_type` | string | body | Yes | Target entity model (e.g., `Order`, `Customer`) |
| `bind_to_id` | string | body | Yes | Target entity ID |
| `selectedLabels` | array | body | No | Array of label IDs to attach |

---

## Attribute Groups

Attribute groups represent variation categories (e.g., Color, Size, Material).

**Prefix:** `/fluent-cart/v2/options/attr` | **Policy:** `ProductPolicy`

### List Attribute Groups

`GET /fluent-cart/v2/options/attr/groups`

#### Permission

`products/view`

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `search` | object | query | No | Column search criteria (`title`, `slug`) |
| `filters` | object | query | No | Filter criteria (e.g., `terms_count`) |
| `with` | array | query | No | Eager load relations (e.g., `["terms"]`) |
| `order_by` | string | query | No | Sort column (`title`, `id`, `slug`, `created_at`). Default: `title` |
| `order_type` | string | query | No | Sort direction (`ASC` or `DESC`). Default: `ASC` |
| `per_page` | integer | query | No | Items per page (default: 10) |
| `page` | integer | query | No | Page number |

#### Response

```json
{
  "groups": {
    "total": 3,
    "per_page": 10,
    "current_page": 1,
    "last_page": 1,
    "data": [
      {
        "id": 1,
        "title": "Color",
        "slug": "color",
        "description": "Product color options",
        "settings": null,
        "created_at": "2025-01-10 08:30:00",
        "updated_at": "2025-01-10 08:30:00",
        "terms_count": 5
      }
    ]
  }
}
```

---

### Create Attribute Group

`POST /fluent-cart/v2/options/attr/group`

#### Permission

`products/create` | **Request Class:** `AttrGroupRequest`

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `title` | string | body | Yes | Group title (max 50 chars). Must be unique in `fct_atts_groups` |
| `slug` | string | body | Yes | Group slug (max 50 chars). Must be unique in `fct_atts_groups` |
| `description` | string | body | No | Group description |
| `settings` | object | body | No | Additional settings object |

---

### Get Attribute Group

`GET /fluent-cart/v2/options/attr/group/{group_id}`

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `group_id` | integer | path | Yes | Attribute Group ID |
| `with` | array | query | No | Eager load relations (e.g., `["terms"]`) |

---

### Update Attribute Group

`PUT /fluent-cart/v2/options/attr/group/{group_id}`

#### Permission

`products/edit` | **Request Class:** `AttrGroupRequest`

---

### Delete Attribute Group

`DELETE /fluent-cart/v2/options/attr/group/{group_id}`

#### Permission

`products/delete`

> **Delete Guard:** A group cannot be deleted if any of its terms are currently assigned to product variations. Attempting to delete an active group returns HTTP `403`: `"This group is already in use, can not be deleted."`.

---

## Attribute Terms

Individual variation values within an attribute group (e.g., "Red", "Blue", "Green").

**Prefix:** `/fluent-cart/v2/options/attr/group/{group_id}` | **Policy:** `ProductPolicy`

### List Attribute Terms

`GET /fluent-cart/v2/options/attr/group/{group_id}/terms`

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `group_id` | integer | path | Yes | Parent attribute group ID |
| `search` | object | query | No | Column search (`title`, `slug`) |
| `order_by` | string | query | No | Sort column (`serial`, `title`, `id`). Default: `serial` |
| `order_type` | string | query | No | Sort direction (`ASC` or `DESC`). Default: `ASC` |
| `per_page` | integer | query | No | Items per page (default: 15) |

---

### Create Attribute Term

`POST /fluent-cart/v2/options/attr/group/{group_id}/term`

#### Permission

`products/create` | **Request Class:** `AttrTermRequest`

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `group_id` | integer | path | Yes | Parent attribute group ID |
| `title` | string | body | Yes | Term title (max 50 chars). Must be unique in `fct_atts_terms` |
| `slug` | string | body | Yes | Term slug (max 50 chars). Must be unique in `fct_atts_terms` |
| `description` | string | body | No | Term description |
| `serial` | integer | body | No | Sort order index (default: `10`) |

---

### Update Attribute Term

`POST /fluent-cart/v2/options/attr/group/{group_id}/term/{term_id}`

#### Permission

`products/edit` | **Request Class:** `AttrTermRequest`

---

### Delete Attribute Term

`DELETE /fluent-cart/v2/options/attr/group/{group_id}/term/{term_id}`

#### Permission

`products/delete`

> **Delete Guard:** Terms assigned to product variations return HTTP `403`: `"This term is already in use, can not be deleted."`.

---

### Change Term Sort Order (Serial Shift)

`POST /fluent-cart/v2/options/attr/group/{group_id}/term/{term_id}/serial`

Increments or decrements the sort order `serial` value of a term.

#### Permission

`products/edit`

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `group_id` | integer | path | Yes | Attribute group ID |
| `term_id` | integer | path | Yes | Term ID to reorder |
| `direction` | string | body | No | `up` (decrements serial, min 0) or `down` (increments serial). Default: `up` |

#### Response

```json
{
  "data": 2,
  "message": "Serial updated."
}
```
