# POST Delete Taxonomy Term

## `POST /products/delete-taxonomy-term/{postId}`

**POST Delete Taxonomy Term**

Remove a specific taxonomy term from a product.

**Required permission:** `products/edit`

- **operationId:** `deleteTaxonomyTerm`
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
    "taxonomy",
    "term"
  ],
  "properties": {
    "taxonomy": {
      "type": "string",
      "description": "Taxonomy name (e.g., product-categories)"
    },
    "term": {
      "type": "integer",
      "description": "Term ID to remove"
    }
  },
  "example": {
    "taxonomy": "product-categories",
    "term": 5
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
