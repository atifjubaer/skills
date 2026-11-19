# POST Create Coupon

## `POST /coupons`

**POST Create Coupon**

Create a new discount coupon.

**Required permission:** `coupons/manage`

- **operationId:** `createCoupon`
- **tags:** Coupons

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "title",
    "code",
    "type",
    "amount",
    "status",
    "stackable",
    "show_on_checkout"
  ],
  "properties": {
    "title": {
      "type": "string",
      "maxLength": 200,
      "description": "Coupon display name"
    },
    "code": {
      "type": "string",
      "maxLength": 50,
      "description": "Unique coupon code. Must be unique across all coupons."
    },
    "type": {
      "type": "string",
      "enum": [
        "fixed",
        "percentage",
        "free_shipping",
        "buy_x_get_y"
      ],
      "description": "Discount type"
    },
    "amount": {
      "type": "number",
      "minimum": 0,
      "description": "Discount amount. For percentage: value 0-100. For fixed: amount in store currency (auto-converted to cents)."
    },
    "status": {
      "type": "string",
      "enum": [
        "active",
        "expired",
        "disabled",
        "scheduled"
      ],
      "description": "Coupon status"
    },
    "stackable": {
      "type": "string",
      "enum": [
        "yes",
        "no"
      ],
      "maxLength": 50,
      "description": "Whether coupon can be combined with others"
    },
    "show_on_checkout": {
      "type": "string",
      "enum": [
        "yes",
        "no"
      ],
      "maxLength": 50,
      "description": "Whether to display the coupon on checkout"
    },
    "priority": {
      "type": "integer",
      "minimum": 0,
      "description": "Sort priority for discount calculation order. Lower numbers are applied first."
    },
    "notes": {
      "type": "string",
      "description": "Internal notes about the coupon"
    },
    "start_date": {
      "type": "string",
      "format": "date-time",
      "description": "Start date in any parseable datetime format. Required if end_date is provided. Automatically converted to GMT."
    },
    "end_date": {
      "type": "string",
      "format": "date-time",
      "description": "End date in any parseable datetime format. Must be after start_date."
    },
    "conditions": {
      "type": "object",
      "description": "Coupon conditions and restrictions",
      "properties": {
        "min_purchase_amount": {
          "type": "number",
          "description": "Minimum purchase amount in store currency (auto-converted to cents)"
        },
        "max_discount_amount": {
          "type": "number",
          "description": "Maximum discount cap in store currency (auto-converted to cents)"
        },
        "max_purchase_amount": {
          "type": "number",
          "description": "Maximum purchase amount allowed"
        },
        "apply_to_whole_cart": {
          "type": "string",
          "enum": [
            "yes",
            "no"
          ],
          "description": "Apply discount to the entire cart"
        },
        "apply_to_quantity": {
          "type": "string",
          "enum": [
            "yes",
            "no"
          ],
          "description": "Apply discount per quantity"
        },
        "max_uses": {
          "type": "integer",
          "description": "Maximum total uses across all customers. Must be >= max_per_customer."
        },
        "max_per_customer": {
          "type": "integer",
          "description": "Maximum uses per individual customer"
        },
        "included_products": {
          "type": "array",
          "items": {
            "type": "integer"
          },
          "description": "Product IDs the coupon is limited to"
        },
        "excluded_products": {
          "type": "array",
          "items": {
            "type": "integer"
          },
          "description": "Product IDs excluded from the coupon"
        },
        "included_categories": {
          "type": "array",
          "items": {
            "type": "integer"
          },
          "description": "Category IDs the coupon is limited to"
        },
        "excluded_categories": {
          "type": "array",
          "items": {
            "type": "integer"
          },
          "description": "Category IDs excluded from the coupon"
        },
        "email_restrictions": {
          "type": "string",
          "description": "Email-based restriction"
        },
        "is_recurring": {
          "type": "string",
          "enum": [
            "yes",
            "no"
          ],
          "description": "Whether the coupon applies to subscription renewals"
        },
        "buy_products": {
          "type": "array",
          "items": {
            "type": "integer"
          },
          "description": "Product IDs for the buy part of buy-x-get-y coupons"
        },
        "get_products": {
          "type": "array",
          "items": {
            "type": "integer"
          },
          "description": "Product IDs for the get part of buy-x-get-y coupons"
        }
      }
    }
  },
  "example": {
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
      "min_purchase_amount": 20,
      "max_discount_amount": 50,
      "max_uses": 500,
      "max_per_customer": 2,
      "apply_to_whole_cart": "yes",
      "is_recurring": "no"
    }
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Coupon created successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`coupons/manage`). |
| `422` | Validation error. |
