# POST Bulk Update Products

## `POST /products/bulk-update`

**POST Bulk Update Products**

Update multiple products at once from the bulk edit view. Maximum 10 products per request. Money fields are in cents: `variants[].item_price`, `variants[].compare_price`, `variants[].item_cost`, and `variants[].other_info.signup_fee` all take cents — e.g. `1999` for $19.99.

**Required permission:** `products/edit`

- **operationId:** `bulkUpdateProducts`
- **tags:** Products

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "products"
  ],
  "properties": {
    "products": {
      "type": "array",
      "maxItems": 10,
      "items": {
        "type": "object"
      },
      "description": "Array of product data objects to update (max 10). Money fields (variants[].item_price, variants[].compare_price, variants[].item_cost, variants[].other_info.signup_fee) are cents."
    }
  },
  "example": {
    "products": [
      {
        "ID": 123,
        "post_title": "Updated Title A",
        "variants": [
          {
            "id": 456,
            "item_price": 1999,
            "compare_price": 2999
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
