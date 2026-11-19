# POST Create Saved View

## `POST /saved-views`

**POST Create Saved View**

Create a saved view for an admin table. A unique slug is generated from the name with a 6-character random suffix.

Each user may hold at most **20** views per table; `query_params` is filtered down to `filter_type`, `advanced_filters`, `search` and `active_view` — any other key is dropped.

**Permission:** varies by `object_type` · **Policy:** `SavedViewsPolicy`

- **operationId:** `createSavedView`
- **tags:** Saved Views

### Request body

`application/json`

```json
{
  "type": "object",
  "properties": {
    "object_type": {
      "type": "string",
      "enum": [
        "product_table",
        "order_table",
        "customers",
        "coupon_table",
        "subscriptions",
        "licenses",
        "order_bump_table",
        "log_table",
        "taxes_table",
        "shipping_zone_table",
        "shipping_class_table"
      ],
      "description": "The admin table the view belongs to. **Required** — it is read by `SavedViewsPolicy` *before* the controller runs, so omitting it returns `403 rest_forbidden` rather than a validation error. Each value maps to a different capability: `product_table`/`order_bump_table` → `products/view`, `order_table`/`log_table` → `orders/view`, `customers` → `customers/view`, `coupon_table` → `coupons/view`, `subscriptions` → `subscriptions/view`, `licenses` → `licenses/view`, and `taxes_table`/`shipping_zone_table`/`shipping_class_table` → `manage_options`. The map is filterable via `fluent_cart/saved_views_permission_map`."
    },
    "name": {
      "type": "string",
      "maxLength": 50,
      "description": "Display name. Required, 50 characters or fewer."
    },
    "description": {
      "type": "string",
      "description": "Optional longer description."
    },
    "is_public": {
      "type": "boolean",
      "default": false,
      "description": "Share the view with all users who can access this table."
    },
    "query_params": {
      "type": "object",
      "properties": {
        "filter_type": {
          "type": "string",
          "description": "Filter mode, e.g. `simple` or `advanced`."
        },
        "advanced_filters": {
          "type": "string",
          "description": "JSON-encoded advanced filter groups. Invalid JSON is stored as `[[]]`."
        },
        "search": {
          "type": "string",
          "description": "Free-text search term."
        },
        "active_view": {
          "type": "string",
          "description": "Active tab on the table."
        }
      },
      "example": {
        "filter_type": "advanced",
        "advanced_filters": "[[{\"source\":\"order\",\"property\":\"status\",\"operator\":\"=\",\"value\":\"completed\"}]]",
        "search": "",
        "active_view": "all"
      }
    }
  },
  "required": [
    "object_type",
    "name"
  ],
  "example": {
    "object_type": "order_table",
    "name": "Unfulfilled orders",
    "description": "Paid orders still awaiting fulfillment",
    "is_public": false,
    "query_params": {
      "filter_type": "advanced",
      "advanced_filters": "[[{\"source\":\"order\",\"property\":\"fulfillment_type\",\"operator\":\"=\",\"value\":\"unfulfilled\"}]]"
    }
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `201` | View created. |
| `403` | Forbidden — the authenticated user lacks the required permission. |
| `422` | Validation failed — missing `object_type`, missing/over-long `name`, or the 20-views-per-table cap reached. |
