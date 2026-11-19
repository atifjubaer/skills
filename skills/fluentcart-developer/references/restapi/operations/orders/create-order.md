# POST Create Order

## `POST /orders`

**POST Create Order**

Create a new order manually from the admin panel.

**Required permission:** `orders/create`

All amounts are in the smallest unit of the **order's currency**: cents for USD or EUR, whole yen for JPY.

### How the order is priced

| You send | Pricing |
|---|---|
| No `currency`, or the store currency | Posted line prices are used as sent. `rate` is ignored. |
| A foreign currency while Multi-Currency is off, or one that is not enabled or has no exchange rate | Refused with `invalid_currency`, even when `rate` is sent. No order is created. |
| An enabled foreign currency, no `rate` | Priced at the store's rate, with its margin and rounding. |
| An enabled foreign currency with `rate` | Priced at that rate exactly as sent: no margin, rounding, charm pricing or adjustment. It must be above 0 with at most 12 integer digits, or the call fails with `invalid_amount`. |
| `quote_revision` from [Price Order](./price-order) | Priced again exactly like the preview. `rate` is ignored. If the revision or `total_amount` no longer matches, the call fails with `fx_prices_updated`. |

For a foreign currency, every posted catalog `unit_price`, and `total_amount` when it is not 0, must match the server's value, or the call fails with `fx_prices_updated` and nothing is saved. Item-level `rate` is always ignored. Coupons and the manual discount are always checked and applied on the server (active, dates, usage limits, per-customer limits, minimum purchase).

Use [List Order Currencies](./list-order-currencies) to find which currencies can be used.

### Not supported

The order is created now, at today's rate. There is no field for a past order date or a historical rate, so this endpoint cannot record old orders.

- **operationId:** `createOrder`
- **tags:** Orders

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
      "description": "ID of the customer placing the order"
    },
    "order_items": {
      "type": "array",
      "description": "Array of order items",
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
          "object_id": {
            "type": "integer",
            "description": "Object reference ID"
          },
          "fulfillment_type": {
            "type": "string",
            "description": "`digital` or `physical`"
          },
          "payment_type": {
            "type": "string",
            "description": "Payment type (max 100 chars), e.g., `subscription`"
          },
          "quantity": {
            "type": "integer",
            "description": "Item quantity (min: 1)",
            "minimum": 1
          },
          "post_title": {
            "type": "string",
            "description": "Product title (max 255 chars)"
          },
          "title": {
            "type": "string",
            "description": "Item title (max 255 chars)"
          },
          "price": {
            "type": "number",
            "description": "Item price in cents. Recomputed by the server."
          },
          "unit_price": {
            "type": "number",
            "description": "Unit price in cents of the order's currency. For a catalog line in a foreign currency it must match the server's converted price, unless `has_custom_price` is true."
          },
          "has_custom_price": {
            "type": "boolean",
            "description": "`true` when the admin typed this price. The server then keeps `unit_price` as sent (in the order's currency, zero or more, whole units for zero-decimal currencies) instead of the catalog price."
          },
          "shipping_charge": {
            "type": "number",
            "description": "Shipping charge in cents"
          },
          "item_cost": {
            "type": "number",
            "description": "Item cost in cents"
          },
          "item_total": {
            "type": "number",
            "description": "Item total in cents"
          },
          "tax_amount": {
            "type": "number",
            "description": "Tax amount in cents"
          },
          "discount_total": {
            "type": "number",
            "description": "Discount total in cents"
          },
          "total": {
            "type": "number",
            "description": "Total in cents"
          },
          "line_total": {
            "type": "number",
            "description": "Line total in cents"
          },
          "cart_index": {
            "type": "integer",
            "description": "Cart position index"
          },
          "rate": {
            "type": "number",
            "description": "Ignored. The order-level `rate` applies."
          },
          "line_meta": {
            "type": "array",
            "description": "Line item metadata",
            "items": {
              "type": "object"
            }
          },
          "other_info": {
            "type": "object",
            "description": "Additional item information"
          }
        }
      }
    },
    "status": {
      "type": "string",
      "description": "Order status (max 50 chars)"
    },
    "invoice_no": {
      "type": "string",
      "description": "Invoice number (max 100 chars)"
    },
    "fulfillment_type": {
      "type": "string",
      "description": "Fulfillment type (max 50 chars)"
    },
    "type": {
      "type": "string",
      "description": "Order type (max 50 chars)"
    },
    "payment_method": {
      "type": "string",
      "description": "Payment method key (max 50 chars)"
    },
    "payment_method_title": {
      "type": "string",
      "description": "Payment method display title (max 50 chars)"
    },
    "payment_status": {
      "type": "string",
      "description": "Payment status (max 50 chars)"
    },
    "currency": {
      "type": "string",
      "description": "Order currency code, e.g. `EUR` (max 10 chars). Must be the store currency or an enabled Multi-Currency currency with a rate. Defaults to the store currency."
    },
    "subtotal": {
      "type": "number",
      "description": "Order subtotal in cents"
    },
    "discount_tax": {
      "type": "number",
      "description": "Discount tax amount in cents"
    },
    "manual_discount_total": {
      "type": "number",
      "description": "Manual discount total in cents"
    },
    "coupon_discount_total": {
      "type": "number",
      "description": "Coupon discount total in cents"
    },
    "shipping_tax": {
      "type": "number",
      "description": "Shipping tax in cents"
    },
    "shipping_total": {
      "type": "number",
      "description": "Shipping total in cents of the order's currency (zero or more, whole units for zero-decimal currencies). If items carry `shipping_charge`, those must add up to this value."
    },
    "tax_total": {
      "type": "number",
      "description": "Tax total in cents"
    },
    "total_amount": {
      "type": "number",
      "description": "Order total in cents, before tax. With `quote_revision`, it must equal the preview's `total_amount`. For a foreign currency without `quote_revision`, a non-zero value must equal the server's total; send 0 or omit it to skip the check."
    },
    "rate": {
      "type": "number",
      "description": "Exchange rate from the store currency to `currency`. Optional; overrides the store's rate for a foreign currency and is stored exactly as sent. Must be above 0 with at most 12 integer digits. Ignored for the store currency and when `quote_revision` is sent."
    },
    "quote_revision": {
      "type": "string",
      "description": "Revision returned by [Price Order](./price-order) (max 32 chars). When sent, the order is priced like that preview and must still match it, or the call fails with `fx_prices_updated`."
    },
    "note": {
      "type": "string",
      "description": "Order note (max 5000 chars)"
    },
    "uuid": {
      "type": "string",
      "description": "Order UUID (max 100 chars)"
    },
    "ip_address": {
      "type": "string",
      "description": "Customer IP address (max 100 chars)"
    },
    "completed_at": {
      "type": "string",
      "description": "Completion timestamp (max 100 chars)"
    },
    "refunded_at": {
      "type": "string",
      "description": "Refund timestamp (max 100 chars)"
    },
    "user_tz": {
      "type": "string",
      "description": "User timezone (max 50 chars)"
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
    "shipping": {
      "type": "array",
      "description": "Shipping method details, stored as order meta for display. The charged amount comes from `shipping_total`.",
      "items": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string",
            "description": "Shipping type (max 100 chars)"
          },
          "rate_name": {
            "type": "string",
            "description": "Shipping rate name (max 100 chars)"
          },
          "custom_price": {
            "type": "number",
            "description": "Custom shipping price in cents"
          }
        }
      }
    },
    "applied_coupon": {
      "type": "object",
      "description": "Coupons to apply, keyed by coupon code, e.g. `{\"SAVE10\": {\"id\": 3}}`. Only the codes are read: discounts are recalculated on the server. On this endpoint each entry must include the coupon `id`.",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "description": "Coupon ID"
          }
        }
      }
    },
    "trigger": {
      "type": "string",
      "description": "Trigger source"
    }
  },
  "example": {
    "customer_id": 1,
    "order_items": [
      {
        "post_id": 10,
        "variation_id": 5,
        "object_id": 5,
        "quantity": 1,
        "unit_price": 2500,
        "price": 2500,
        "item_total": 2500,
        "total": 2500,
        "line_total": 2500,
        "title": "Pro License"
      }
    ],
    "subtotal": 2500,
    "total_amount": 2500,
    "payment_method": "offline_payment"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Order created successfully. |
| `400` | A line's payment type does not match its product, or subscriptions are turned off for manual orders by the `fluent_cart/order/is_subscription_allowed_in_manual_order` filter. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`orders/create`). |
| `422` | Validation failed, a price no longer matches, or a currency/amount is not allowed. |
