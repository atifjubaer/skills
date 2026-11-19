# PUT Update Inventory

## `PUT /products/{postId}/update-inventory/{variantId}`

**PUT Update Inventory**

Update stock levels for a specific variant. Automatically updates stock status and product-level availability.

**Required permission:** `products/edit`

- **operationId:** `updateInventory`
- **tags:** Products

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `postId` | path | yes | integer | The product post ID |
| `variantId` | path | yes | integer | The variant ID to update |

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "total_stock",
    "available"
  ],
  "properties": {
    "total_stock": {
      "type": "integer",
      "description": "Total stock quantity"
    },
    "available": {
      "type": "integer",
      "description": "Available stock quantity"
    }
  },
  "example": {
    "total_stock": 100,
    "available": 80
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
