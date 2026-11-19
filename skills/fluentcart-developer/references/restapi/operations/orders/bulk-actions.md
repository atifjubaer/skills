# POST Bulk Actions

## `POST /orders/do-bulk-action`

**POST Bulk Actions**

Perform bulk actions on multiple orders at once.

**Required permission:** `orders/manage`

- **operationId:** `bulkActions`
- **tags:** Orders

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "action",
    "order_ids"
  ],
  "properties": {
    "action": {
      "type": "string",
      "description": "Bulk action to perform",
      "enum": [
        "delete_orders",
        "change_shipping_status",
        "change_order_status",
        "capture_payments",
        "change_payment_status"
      ]
    },
    "order_ids": {
      "type": "array",
      "description": "Array of order IDs to act upon",
      "items": {
        "type": "integer"
      }
    },
    "new_status": {
      "type": "string",
      "description": "New status value. Required for `change_shipping_status`, `change_order_status`, and `change_payment_status` actions"
    },
    "manage_stock": {
      "type": "string",
      "description": "Whether to manage stock on status change (`true`/`false`)"
    }
  },
  "example": {
    "action": "change_order_status",
    "order_ids": [
      1,
      2,
      3
    ],
    "new_status": "processing"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Bulk action performed successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`orders/manage`). |
| `422` | Validation failed, or the referenced record does not exist. |
