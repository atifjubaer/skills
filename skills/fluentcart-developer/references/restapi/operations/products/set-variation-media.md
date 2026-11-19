# POST Set Variation Media

## `POST /products/variants/{variantId}/setMedia`

**POST Set Variation Media**

Set media/images for a variation.

**Required permission:** `products/edit`

- **operationId:** `setVariationMedia`
- **tags:** Products

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `variantId` | path | yes | integer | The variation ID |

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "media"
  ],
  "properties": {
    "media": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "id"
        ],
        "properties": {
          "id": {
            "type": "integer",
            "description": "WordPress attachment ID"
          },
          "title": {
            "type": "string",
            "description": "Image title"
          },
          "url": {
            "type": "string",
            "description": "Image URL"
          }
        }
      }
    }
  },
  "example": {
    "media": [
      {
        "id": 101,
        "title": "Product Image",
        "url": "https://example.com/wp-content/uploads/product.jpg"
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
