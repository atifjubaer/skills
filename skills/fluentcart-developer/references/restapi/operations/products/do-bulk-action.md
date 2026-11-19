# POST Do Bulk Action

## `POST /products/do-bulk-action`

**POST Do Bulk Action**

Perform bulk actions on selected products (e.g., publish, draft, delete).

**Required permission:** `products/edit`

- **operationId:** `doBulkAction`
- **tags:** Products

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "action",
    "product_ids"
  ],
  "properties": {
    "action": {
      "type": "string",
      "description": "The bulk action to perform"
    },
    "product_ids": {
      "type": "array",
      "items": {
        "type": "integer"
      },
      "description": "Array of product IDs to act on"
    }
  },
  "example": {
    "action": "publish",
    "product_ids": [
      123,
      456,
      789
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
