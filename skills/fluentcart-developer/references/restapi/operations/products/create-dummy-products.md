# POST Create Dummy Products

## `POST /products/create-dummy`

**POST Create Dummy Products**

Create sample/demo products for testing or onboarding purposes.

**Required permission:** `products/create`

- **operationId:** `createDummyProducts`
- **tags:** Products

### Request body

`application/json`

```json
{
  "type": "object",
  "properties": {
    "category": {
      "type": "string",
      "description": "Product category for dummy products"
    },
    "index": {
      "type": "integer",
      "description": "Index for dummy product generation"
    }
  },
  "example": {
    "category": "digital",
    "index": 1
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Returns the created dummy product data. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`products/create`). |
| `422` | Validation failed, or the referenced record does not exist. |
