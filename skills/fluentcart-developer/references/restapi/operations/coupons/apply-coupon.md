# POST Apply Coupon

## `POST /coupons/apply`

**POST Apply Coupon**

Apply a coupon code to a set of order line items. This endpoint validates the coupon, checks eligibility for each line item, and returns the recalculated discount breakdown.

**Required permissions:** all of `orders/create`, `orders/manage`

- **operationId:** `applyCoupon`
- **tags:** Coupons

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "coupon_code",
    "order_items"
  ],
  "properties": {
    "coupon_code": {
      "type": "string",
      "description": "The coupon code to apply"
    },
    "order_items": {
      "type": "array",
      "description": "Array of order line item objects",
      "items": {
        "$ref": "#/components/schemas/OrderItem"
      }
    },
    "order_uuid": {
      "type": "string",
      "maxLength": 100,
      "description": "UUID of an existing order to apply the coupon to. When provided, previously applied coupons from the order are included."
    },
    "applied_coupons": {
      "type": "array",
      "items": {
        "type": "integer"
      },
      "description": "Array of coupon IDs that are already applied (but not yet persisted to the order)"
    },
    "customer_email": {
      "type": "string",
      "format": "email",
      "description": "Customer email for email-based coupon restrictions"
    }
  },
  "example": {
    "coupon_code": "WELCOME20",
    "order_items": [
      {
        "post_id": 123,
        "quantity": 1,
        "price": 9900,
        "unit_price": 9900,
        "item_total": 9900,
        "line_total": 9900,
        "other_info": {
          "payment_type": "onetime"
        }
      }
    ],
    "applied_coupons": [],
    "customer_email": "sarah.johnson@example.com"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Coupon applied successfully. Returns the applied coupons and recalculated items. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`orders/create, orders/manage`). |
| `422` | Validation failed, or the referenced record does not exist. |
