# POST Save Upgrade Path

## `POST /products/{id}/upgrade-path`

**POST Save Upgrade Path**

Create a new upgrade path for a product.

**Required permission:** `products/edit`

- **operationId:** `saveUpgradePath`
- **tags:** Products

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `id` | path | yes | integer | The product ID |

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "from_variant",
    "to_variants"
  ],
  "properties": {
    "from_variant": {
      "type": "integer",
      "description": "Source variation ID (must exist in fct_product_variations)"
    },
    "to_variants": {
      "type": "array",
      "items": {
        "type": "integer"
      },
      "description": "Array of target variation IDs"
    },
    "discount_amount": {
      "type": "number",
      "description": "Discount amount for the upgrade"
    },
    "title": {
      "type": "string",
      "description": "Upgrade path title"
    },
    "description": {
      "type": "string",
      "description": "Upgrade path description"
    },
    "slug": {
      "type": "string",
      "description": "Upgrade path slug"
    }
  },
  "example": {
    "from_variant": 456,
    "to_variants": [
      457,
      458
    ],
    "discount_amount": 500
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
