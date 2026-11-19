# POST Sync Taxonomy Terms

## `POST /products/sync-taxonomy-term/{postId}`

**POST Sync Taxonomy Terms**

Sync (replace) taxonomy terms for a product.

**Required permission:** `products/edit`

- **operationId:** `syncTaxonomyTerms`
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
    "taxonomy"
  ],
  "properties": {
    "taxonomy": {
      "type": "string",
      "description": "Taxonomy name (e.g., product-categories)"
    },
    "terms": {
      "type": "array",
      "items": {
        "type": "integer"
      },
      "description": "Array of term IDs to sync"
    }
  },
  "example": {
    "taxonomy": "product-categories",
    "terms": [
      1,
      5,
      10
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
