# POST Update Variation

## `POST /products/variants/{variantId}`

**POST Update Variation**

Update an existing product variation.

**Required permission:** `products/edit`

- **operationId:** `updateVariation`
- **tags:** Products

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `variantId` | path | yes | integer | The variation ID to update |

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
      "properties": {
        "id": {
          "type": "integer"
        },
        "post_id": {
          "type": "integer"
        },
        "variation_title": {
          "type": "string"
        },
        "item_price": {
          "type": "number",
          "description": "Price in cents (min: 0)."
        },
        "compare_price": {
          "type": "number",
          "description": "Compare-at price in cents."
        },
        "sku": {
          "type": "string"
        },
        "fulfillment_type": {
          "type": "string",
          "enum": [
            "physical",
            "digital"
          ]
        },
        "total_stock": {
          "type": "integer"
        },
        "available": {
          "type": "integer"
        },
        "committed": {
          "type": "integer"
        },
        "on_hold": {
          "type": "integer"
        },
        "other_info": {
          "type": "object"
        }
      }
    }
  },
  "example": {
    "variants": {
      "id": 460,
      "post_id": 123,
      "variation_title": "Pro Plan - Updated",
      "item_price": 3999,
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
| `403` | Authenticated, but the user lacks the required capability (`products/edit`). |
| `422` | Validation failed, or the referenced record does not exist. |
