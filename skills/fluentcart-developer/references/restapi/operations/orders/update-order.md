# POST Update Order

## `POST /orders/{order_id}`

**POST Update Order**

Update an existing order's details, items, discounts, shipping, and coupons. Subscription orders cannot be edited.

**Required permission:** `orders/manage`

- **operationId:** `updateOrder`
- **tags:** Orders

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `order_id` | path | yes | integer | Order ID |

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "customer_id",
    "order_items"
  ],
  "properties": {
    "customer_id": {
      "type": "integer",
      "description": "Customer ID"
    },
    "order_items": {
      "type": "array",
      "description": "Updated array of order items (same structure as Create Order)",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "description": "Order item ID (for updates)"
          },
          "order_id": {
            "type": "integer",
            "description": "Parent order ID"
          },
          "post_id": {
            "type": "integer",
            "description": "WordPress post ID of the product"
          },
          "variation_id": {
            "type": "integer",
            "description": "Product variation ID"
          },
          "quantity": {
            "type": "integer",
            "description": "Item quantity",
            "minimum": 1
          },
          "unit_price": {
            "type": "number",
            "description": "Unit price in cents"
          },
          "line_total": {
            "type": "number",
            "description": "Line total in cents"
          },
          "title": {
            "type": "string",
            "description": "Item title"
          }
        }
      }
    },
    "status": {
      "type": "string",
      "description": "Order status (cannot be set to `completed`)"
    },
    "payment_status": {
      "type": "string",
      "description": "Payment status"
    },
    "subtotal": {
      "type": "number",
      "description": "Updated subtotal in cents"
    },
    "total_amount": {
      "type": "number",
      "description": "Updated total amount in cents"
    },
    "total_paid": {
      "type": "number",
      "description": "Total amount already paid in cents"
    },
    "shipping_total": {
      "type": "number",
      "description": "Updated shipping total in cents"
    },
    "tax_total": {
      "type": "number",
      "description": "Updated tax total in cents"
    },
    "manual_discount_total": {
      "type": "number",
      "description": "Manual discount in cents"
    },
    "coupon_discount_total": {
      "type": "number",
      "description": "Coupon discount in cents"
    },
    "discount": {
      "type": "object",
      "description": "Discount details (see Create Order)"
    },
    "shipping": {
      "type": "array",
      "description": "Shipping details (see Create Order)",
      "items": {
        "type": "object"
      }
    },
    "applied_coupon": {
      "type": "array",
      "description": "Applied coupon details (see Create Order)",
      "items": {
        "type": "object"
      }
    },
    "deletedItems": {
      "type": "array",
      "description": "Array of order item IDs to remove",
      "items": {
        "type": "integer"
      }
    },
    "couponCalculation": {
      "type": "array",
      "description": "Coupon calculation details",
      "items": {
        "type": "object"
      }
    }
  },
  "example": {
    "customer_id": 1,
    "order_items": [
      {
        "id": 10,
        "order_id": 42,
        "quantity": 2,
        "unit_price": 2500,
        "line_total": 5000
      }
    ],
    "subtotal": 5000,
    "total_amount": 5000
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Order updated successfully. |
| `400` | Bad request - subscription order or completed status update. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`orders/manage`). |
| `422` | Validation failed, or the referenced record does not exist. |
