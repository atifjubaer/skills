# POST Update Product Pricing

## `POST /products/{postId}/pricing`

**POST Update Product Pricing**

Update a product's pricing, details, variants, and other metadata.

**Required permission:** `products/edit`

- **operationId:** `updateProductPricing`
- **tags:** Products

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `postId` | path | yes | integer | The product post ID |

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "post_title",
    "post_status",
    "detail"
  ],
  "properties": {
    "post_title": {
      "type": "string",
      "description": "Product title (max 200 characters)"
    },
    "post_status": {
      "type": "string",
      "enum": [
        "draft",
        "publish",
        "future"
      ],
      "description": "Product status"
    },
    "post_date": {
      "type": "string",
      "description": "Required when post_status is future. Must be a future date (GMT)"
    },
    "post_excerpt": {
      "type": "string",
      "description": "Product short description"
    },
    "post_content": {
      "type": "string",
      "description": "Product long description (HTML allowed)"
    },
    "post_name": {
      "type": "string",
      "description": "Product URL slug"
    },
    "comment_status": {
      "type": "string",
      "description": "Comment status (max 100 chars)"
    },
    "detail": {
      "type": "object",
      "required": [
        "fulfillment_type",
        "variation_type"
      ],
      "properties": {
        "fulfillment_type": {
          "type": "string",
          "enum": [
            "physical",
            "digital"
          ]
        },
        "variation_type": {
          "type": "string",
          "enum": [
            "simple",
            "simple_variations"
          ]
        },
        "manage_stock": {
          "type": "integer",
          "enum": [
            0,
            1
          ]
        },
        "manage_downloadable": {
          "type": "integer",
          "enum": [
            0,
            1
          ]
        },
        "default_variation_id": {
          "type": "integer"
        },
        "stock_availability": {
          "type": "string"
        },
        "other_info": {
          "type": "object",
          "properties": {
            "group_pricing_by": {
              "type": "string",
              "enum": [
                "payment_type",
                "repeat_interval",
                "none"
              ]
            },
            "sold_individually": {
              "type": "string",
              "enum": [
                "yes",
                "no"
              ]
            },
            "use_pricing_table": {
              "type": "string"
            },
            "shipping_class": {
              "type": "integer"
            },
            "tax_class": {
              "type": "integer"
            },
            "active_editor": {
              "type": "string"
            }
          }
        }
      }
    },
    "variants": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "variation_title": {
            "type": "string"
          },
          "post_id": {
            "type": "integer"
          },
          "item_price": {
            "type": "number",
            "description": "Price in cents (min: 0)."
          },
          "compare_price": {
            "type": "number",
            "description": "Compare-at price in cents."
          },
          "manage_cost": {
            "type": "string"
          },
          "item_cost": {
            "type": "number",
            "description": "Item cost in cents (required if manage_cost is true)."
          },
          "serial_index": {
            "type": "integer"
          },
          "sku": {
            "type": "string"
          },
          "fulfillment_type": {
            "type": "string"
          },
          "other_info": {
            "type": "object"
          }
        }
      }
    },
    "product_terms": {
      "type": "object",
      "description": "Taxonomy term IDs"
    },
    "gallery": {
      "type": "array",
      "items": {
        "type": "object"
      }
    },
    "metaValue": {
      "description": "Additional metadata"
    }
  },
  "example": {
    "post_title": "Updated Product",
    "post_status": "publish",
    "detail": {
      "fulfillment_type": "digital",
      "variation_type": "simple"
    },
    "variants": [
      {
        "id": 789,
        "post_id": 123,
        "variation_title": "Default Plan",
        "item_price": 1999,
        "other_info": {
          "payment_type": "onetime"
        }
      }
    ]
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`products/edit`). |
| `422` | Validation failed, or the referenced record does not exist. |
