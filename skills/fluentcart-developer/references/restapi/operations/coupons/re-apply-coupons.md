# POST Re-apply Coupons

## `POST /coupons/re-apply`

**POST Re-apply Coupons**

Recalculate all previously applied coupons against the current order items. This is used when order items change (e.g., quantity update, item added/removed) and discounts need to be recalculated. If order_items is empty, all applied coupons on the order are deleted.

**Required permissions:** all of `orders/create`, `orders/manage`

- **operationId:** `reApplyCoupons`
- **tags:** Coupons

### Request body

`application/json`

```json
{
  "type": "object",
  "properties": {
    "order_uuid": {
      "type": "string",
      "description": "UUID of the existing order whose applied coupons should be reapplied"
    },
    "order_items": {
      "type": "array",
      "description": "Array of current order line item objects. If empty, all applied coupons on the order are removed.",
      "items": {
        "$ref": "#/components/schemas/OrderItem"
      }
    },
    "applied_coupons": {
      "type": "array",
      "items": {
        "type": "integer"
      },
      "description": "Array of coupon IDs to include (in addition to those already on the order). Values are cast to integers."
    }
  },
  "example": {
    "order_uuid": "e7b3a1d4-5f2c-48e9-a6b1-c3d4e5f67890",
    "order_items": [
      {
        "post_id": 123,
        "quantity": 1,
        "price": 9900,
        "unit_price": 9900,
        "item_total": 9900,
        "line_total": 9900
      },
      {
        "post_id": 130,
        "quantity": 2,
        "price": 4900,
        "unit_price": 4900,
        "item_total": 9800,
        "line_total": 9800
      }
    ],
    "applied_coupons": [
      3
    ]
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Coupons re-applied successfully. Returns the recalculated applied coupons and items. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`orders/create, orders/manage`). |
| `422` | Validation failed, or the referenced record does not exist. |
