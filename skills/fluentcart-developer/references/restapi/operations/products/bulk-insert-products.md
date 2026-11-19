# POST Bulk Insert Products

## `POST /products/bulk-insert`

**POST Bulk Insert Products**

Insert multiple products at once. Maximum 10 products per request. Money fields are in cents: `detail.item_price`, `detail.compare_price` (single-variation products), and `variants[].item_price`, `variants[].compare_price`, `variants[].other_info.signup_fee` (multi-variation products) all take cents — e.g. `1999` for $19.99.

**Required permission:** `products/create`

- **operationId:** `bulkInsertProducts`
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
      "description": "Array of product data objects (max 10). Money fields (detail.item_price, detail.compare_price, variants[].item_price, variants[].compare_price, variants[].other_info.signup_fee) are cents."
    }
  },
  "example": {
    "products": [
      {
        "post_title": "Product A",
        "detail": {
          "fulfillment_type": "digital",
          "item_price": 1999,
          "compare_price": 2999
        }
      },
      {
        "post_title": "Product B",
        "detail": {
          "fulfillment_type": "physical"
        }
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
| `403` | Authenticated, but the user lacks the required capability (`products/create`). |
| `422` | Validation failed, or the referenced record does not exist. |
