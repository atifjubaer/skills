# POST Add Product Terms

## `POST /products/add-product-terms`

**POST Add Product Terms**

Create new taxonomy terms for products (categories, brands, etc.).

**Required permission:** `products/edit`

- **operationId:** `addProductTerms`
- **tags:** Products

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "term"
  ],
  "properties": {
    "term": {
      "type": "object",
      "required": [
        "name",
        "taxonomy"
      ],
      "properties": {
        "name": {
          "type": "string",
          "description": "Term name(s), comma-separated for multiple"
        },
        "taxonomy": {
          "type": "string",
          "description": "Taxonomy name (e.g., product-categories, product-brands)"
        },
        "parent": {
          "type": "integer",
          "description": "Parent term ID for hierarchical terms"
        }
      }
    }
  },
  "example": {
    "term": {
      "name": "New Category,Another Category",
      "taxonomy": "product-categories",
      "parent": 0
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
