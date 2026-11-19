# POST Fetch Terms by Parent

## `POST /products/fetch-term-by-parent`

**POST Fetch Terms by Parent**

Retrieve taxonomy terms filtered by parent term IDs.

**Required permission:** `products/view`

- **operationId:** `fetchTermsByParent`
- **tags:** Products

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "parents",
    "listeners"
  ],
  "properties": {
    "parents": {
      "type": "array",
      "items": {
        "type": "integer"
      },
      "description": "Array of parent term IDs"
    },
    "listeners": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Array of taxonomy names to retrieve terms for"
    }
  },
  "example": {
    "parents": [
      1,
      2
    ],
    "listeners": [
      "product-categories"
    ]
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`products/view`). |
| `422` | Validation failed, or the referenced record does not exist. |
