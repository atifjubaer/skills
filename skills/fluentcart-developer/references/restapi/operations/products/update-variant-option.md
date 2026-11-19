# POST Update Variant Option

## `POST /products/{postId}/update-variant-option`

**POST Update Variant Option**

Sync variant options for a product (used when managing product attribute variations).

**Required permission:** `products/edit`

- **operationId:** `updateVariantOption`
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
    "variation_type",
    "product_id",
    "options"
  ],
  "properties": {
    "variation_type": {
      "type": "string",
      "description": "The variation type"
    },
    "product_id": {
      "type": "integer",
      "description": "The product ID"
    },
    "options": {
      "type": "array",
      "items": {
        "type": "object"
      },
      "description": "Array of option objects with id and variants"
    }
  },
  "example": {
    "variation_type": "simple_variations",
    "product_id": 123,
    "options": [
      {
        "id": 1,
        "name": "License Type",
        "variants": [
          {
            "id": 456,
            "value": "Personal"
          },
          {
            "id": 457,
            "value": "Business"
          }
        ]
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
