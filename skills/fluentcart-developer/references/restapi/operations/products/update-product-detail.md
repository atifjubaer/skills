# POST Update Product Detail

## `POST /products/detail/{detailId}`

**POST Update Product Detail**

Update a product detail record (e.g., change variation type).

**Required permission:** `products/edit`

- **operationId:** `updateProductDetail`
- **tags:** Products

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `detailId` | path | yes | integer | The product detail ID |

### Request body

`application/json`

```json
{
  "type": "object",
  "properties": {
    "variation_type": {
      "type": "string",
      "description": "New variation type (e.g., simple, simple_variations)"
    },
    "variation_ids": {
      "type": "array",
      "items": {
        "type": "integer"
      },
      "description": "Array of variation IDs"
    },
    "action": {
      "type": "string",
      "description": "Action to perform (default: change_variation_type)"
    }
  },
  "example": {
    "variation_type": "simple_variations",
    "action": "change_variation_type"
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
