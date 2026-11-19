# PUT Update Order Bump

## `PUT /order_bump/{id}`

**PUT Update Order Bump**

Update an existing order bump's configuration, conditions, status, and display settings.

**Permission:** `store/sensitive` · **Policy:** `OrderBumpPolicy`

- **operationId:** `updateOrderBump`
- **tags:** Order Bumps

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `id` | path | yes | integer | The order bump ID. |

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "title",
    "src_object_id"
  ],
  "properties": {
    "title": {
      "type": "string",
      "maxLength": 194,
      "description": "Display title. Max 194 characters."
    },
    "src_object_id": {
      "type": "integer",
      "description": "Product variation ID for the bump offer."
    },
    "status": {
      "type": "string",
      "enum": [
        "active",
        "draft"
      ],
      "maxLength": 50,
      "description": "Order bump status."
    },
    "src_object_type": {
      "type": "string",
      "maxLength": 50,
      "description": "Source object type identifier."
    },
    "description": {
      "type": "string",
      "description": "HTML description displayed to the customer. Sanitized with wp_kses_post."
    },
    "config": {
      "type": "object",
      "description": "Configuration object.",
      "properties": {
        "discount": {
          "type": "object",
          "properties": {
            "discount_type": {
              "type": "string",
              "enum": [
                "percentage",
                "fixed"
              ],
              "description": "Discount type."
            },
            "discount_amount": {
              "type": "number",
              "description": "Discount amount. For percentage: value 0-100. For fixed: amount in cents."
            }
          }
        },
        "display_conditions_if": {
          "type": "string",
          "description": "Logical operator for combining conditions."
        },
        "call_to_action": {
          "type": "string",
          "description": "Button or checkbox text shown to the customer."
        }
      }
    },
    "conditions": {
      "type": "array",
      "description": "Array of display condition objects that control when the order bump is displayed during checkout.",
      "items": {
        "type": "object"
      }
    },
    "priority": {
      "type": "integer",
      "minimum": 1,
      "description": "Display priority. Lower numbers appear first."
    }
  },
  "example": {
    "title": "Add Extended Warranty",
    "src_object_id": 42,
    "status": "active",
    "description": "<p>Protect your purchase with our 2-year extended warranty.</p>",
    "priority": 1,
    "config": {
      "discount": {
        "discount_type": "percentage",
        "discount_amount": 10
      },
      "display_conditions_if": "",
      "call_to_action": "Yes, add warranty!"
    },
    "conditions": [
      {
        "type": "cart_products",
        "operator": "contains",
        "value": [
          123,
          124
        ]
      },
      {
        "type": "cart_total",
        "operator": "greater_than",
        "value": 2500
      }
    ]
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `400` | Error response |
