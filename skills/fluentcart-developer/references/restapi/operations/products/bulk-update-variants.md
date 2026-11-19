# POST Bulk Update Product Variants

## `POST /products/variants/bulk-update`

**POST Bulk Update Product Variants**

Update price and status fields on multiple product variants in one request. All targeted variants must belong to the same product. Rows in the payload that target the same variant ID are merged (last field wins), the batch is applied inside a single locked transaction, and the `item_price` / `compare_price` relationship is enforced in both directions — raising `item_price` above an existing `compare_price` clears `compare_price`, and a `compare_price` below `item_price` is rejected back to 0. Up to 500 update rows are processed per request; additional rows are silently dropped. `item_price` and `compare_price` are submitted as cents (e.g. `2999` for $29.99), matching every other price field in the API — sending `29.99` creates a 29-cent price, not a $29.99 one.

**Required permission:** `products/edit`

- **operationId:** `bulkUpdate`
- **tags:** Products

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "updates"
  ],
  "properties": {
    "updates": {
      "type": "array",
      "description": "Variant updates. Each row must include id plus at least one of item_price, compare_price, or item_status.",
      "items": {
        "type": "object",
        "required": [
          "id"
        ],
        "properties": {
          "id": {
            "type": "integer",
            "description": "Product variation ID."
          },
          "item_price": {
            "type": "number",
            "description": "New price in cents (e.g. 2999 for $29.99)."
          },
          "compare_price": {
            "type": "number",
            "description": "New compare-at price in cents. Must be 0 or >= item_price."
          },
          "item_status": {
            "type": "string",
            "enum": [
              "active",
              "inactive"
            ],
            "description": "New variant status."
          }
        }
      }
    }
  },
  "example": {
    "updates": [
      {
        "id": 501,
        "item_price": 2999,
        "compare_price": 3999,
        "item_status": "active"
      },
      {
        "id": 502,
        "item_price": 2499
      }
    ]
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Variants updated successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `404` | One or more variant IDs do not exist. |
| `422` | No updates provided, or the updates target variants across more than one product. |
