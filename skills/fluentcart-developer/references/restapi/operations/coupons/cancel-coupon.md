# POST Cancel Coupon

## `POST /coupons/cancel`

**POST Cancel Coupon**

Remove a coupon from an order and recalculate the remaining discounts. If an order_uuid is provided and the coupon was already persisted to the order, it is deleted from the fct_applied_coupons table and the coupon's use_count is decremented.

**Required permissions:** all of `orders/create`, `orders/manage`

- **operationId:** `cancelCoupon`
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
      "description": "The coupon code to cancel"
    },
    "order_items": {
      "type": "array",
      "description": "Array of current order line item objects",
      "items": {
        "$ref": "#/components/schemas/OrderItem"
      }
    },
    "id": {
      "type": "integer",
      "description": "The applied coupon record ID (from fct_applied_coupons). Required to delete the persisted record from an existing order."
    },
    "order_uuid": {
      "type": "string",
      "maxLength": 100,
      "description": "UUID of the existing order"
    },
    "applied_coupons": {
      "type": "array",
      "items": {
        "type": "integer"
      },
      "description": "Array of remaining coupon IDs that should stay applied"
    },
    "customer_email": {
      "type": "string",
      "format": "email",
      "description": "Customer email address"
    }
  },
  "example": {
    "coupon_code": "WELCOME20",
    "id": 9,
    "order_uuid": "e7b3a1d4-5f2c-48e9-a6b1-c3d4e5f67890",
    "order_items": [
      {
        "post_id": 123,
        "quantity": 1,
        "price": 9900,
        "unit_price": 9900,
        "item_total": 9900,
        "line_total": 9900
      }
    ],
    "applied_coupons": [
      5
    ]
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Coupon cancelled successfully. Returns remaining applied coupons and recalculated items. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`orders/create, orders/manage`). |
| `422` | Validation failed, or the referenced record does not exist. |
