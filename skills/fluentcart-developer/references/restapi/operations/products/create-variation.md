# POST Create Variation

## `POST /products/variants`

**POST Create Variation**

Create a new product variation.

**Required permission:** `products/create`

- **operationId:** `createVariation`
- **tags:** Products

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "variants"
  ],
  "properties": {
    "variants": {
      "type": "object",
      "required": [
        "post_id",
        "variation_title",
        "fulfillment_type",
        "total_stock",
        "available",
        "committed",
        "on_hold"
      ],
      "properties": {
        "post_id": {
          "type": "integer",
          "description": "Parent product ID"
        },
        "variation_title": {
          "type": "string",
          "description": "Variation title (max 200 chars)"
        },
        "sku": {
          "type": "string",
          "description": "SKU (max 30 chars, must be unique)"
        },
        "item_price": {
          "type": "number",
          "description": "Price in cents (min: 0)"
        },
        "compare_price": {
          "type": "number",
          "description": "Compare-at price in cents"
        },
        "manage_cost": {
          "type": "string",
          "description": "Enable cost tracking"
        },
        "item_cost": {
          "type": "number",
          "description": "Item cost (required if manage_cost is true)"
        },
        "fulfillment_type": {
          "type": "string",
          "enum": [
            "physical",
            "digital"
          ]
        },
        "manage_stock": {
          "type": "integer",
          "enum": [
            0,
            1
          ]
        },
        "stock_status": {
          "type": "string",
          "enum": [
            "in-stock",
            "out-of-stock"
          ]
        },
        "total_stock": {
          "type": "integer",
          "description": "Total stock quantity"
        },
        "available": {
          "type": "integer",
          "description": "Available stock"
        },
        "committed": {
          "type": "integer",
          "description": "Committed stock"
        },
        "on_hold": {
          "type": "integer",
          "description": "Stock on hold"
        },
        "serial_index": {
          "type": "integer",
          "description": "Display order index"
        },
        "downloadable": {
          "type": "string",
          "description": "Downloadable flag"
        },
        "other_info": {
          "type": "object",
          "properties": {
            "payment_type": {
              "type": "string",
              "enum": [
                "onetime",
                "subscription"
              ]
            },
            "description": {
              "type": "string"
            },
            "repeat_interval": {
              "type": "string"
            },
            "times": {
              "type": "number"
            },
            "trial_days": {
              "type": "number"
            },
            "billing_summary": {
              "type": "string"
            },
            "manage_setup_fee": {
              "type": "string"
            },
            "signup_fee": {
              "type": "number"
            },
            "signup_fee_name": {
              "type": "string"
            }
          }
        },
        "media": {
          "type": "array",
          "items": {
            "type": "object"
          }
        }
      }
    }
  },
  "example": {
    "variants": {
      "post_id": 123,
      "variation_title": "Pro Plan",
      "item_price": 2999,
      "sku": "PRO-PLN",
      "fulfillment_type": "digital",
      "total_stock": 1,
      "available": 1,
      "committed": 0,
      "on_hold": 0,
      "other_info": {
        "payment_type": "onetime"
      }
    }
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`products/create`). |
| `422` | Validation failed, or the referenced record does not exist. |
