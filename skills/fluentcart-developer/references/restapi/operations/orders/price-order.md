# POST Price Order

## `POST /orders/price`

**POST Price Order**

Price an admin order before creating it. Nothing is saved.

**Required permission:** `orders/create`

Catalog lines are priced from the product in the requested `currency` at the store's exchange rate. Coupons and the manual discount are validated and applied the same way [Create Order](./create-order) applies them.

To save exactly what was previewed, send the returned `quote_revision` and `total_amount` to Create Order with the same `currency`, lines, coupons, discount and shipping. If the rate or a price changed in between, Create Order fails with `fx_prices_updated`; price the order again and resend.

Amounts are in cents of the order's currency, before tax.

- **operationId:** `priceOrder`
- **tags:** Orders

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "order_items"
  ],
  "properties": {
    "customer_id": {
      "type": "integer",
      "description": "Optional. When given, per-customer coupon limits are checked for this customer."
    },
    "currency": {
      "type": "string",
      "description": "Order currency code, e.g. `EUR` (max 10 chars). Must be the store currency or an enabled Multi-Currency currency with a rate. Defaults to the store currency."
    },
    "order_items": {
      "type": "array",
      "description": "Lines to price.",
      "items": {
        "type": "object",
        "properties": {
          "post_id": {
            "type": "integer",
            "description": "WordPress post ID of the product"
          },
          "variation_id": {
            "type": "integer",
            "description": "Product variation ID"
          },
          "object_id": {
            "type": "integer",
            "description": "Product variation ID. The line is priced from this variation."
          },
          "quantity": {
            "type": "integer",
            "description": "Item quantity (min: 1)",
            "minimum": 1
          },
          "unit_price": {
            "type": "number",
            "description": "Only read when `has_custom_price` is true. Catalog lines are always priced from the product."
          },
          "has_custom_price": {
            "type": "boolean",
            "description": "`true` when the admin typed this price. The server then keeps `unit_price` as sent (in the order's currency, zero or more, whole units for zero-decimal currencies) instead of the catalog price."
          },
          "shipping_charge": {
            "type": "number",
            "description": "Shipping charge in cents"
          },
          "other_info": {
            "type": "object",
            "description": "Additional item information"
          }
        }
      }
    },
    "applied_coupon": {
      "type": "object",
      "description": "Coupons to apply, keyed by coupon code. The `id` is optional here, so a new code can be sent as `{\"SAVE10\": {}}`. An unknown or invalid code fails with 422.",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "description": "Coupon ID (optional)"
          }
        }
      }
    },
    "discount": {
      "type": "object",
      "description": "Manual discount. Only `value` (in the order's currency, not cents) is used for the amount; it cannot exceed the order subtotal.",
      "properties": {
        "type": {
          "type": "string",
          "description": "Ignored. The value is always a fixed amount."
        },
        "value": {
          "type": "number",
          "description": "Discount amount in the order's currency, e.g. `5` for 5.00."
        },
        "label": {
          "type": "string",
          "description": "Discount label (max 100 chars)"
        },
        "reason": {
          "type": "string",
          "description": "Discount reason (max 100 chars)"
        },
        "action": {
          "type": "string",
          "description": "Discount action (max 100 chars)"
        }
      }
    },
    "shipping_total": {
      "type": "number",
      "description": "Shipping total in cents of the order's currency (zero or more, whole units for zero-decimal currencies). If items carry `shipping_charge`, those must add up to this value."
    }
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Order priced. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`orders/create`). |
| `422` | Validation failed, or a currency, amount, coupon or product is not allowed. |
