# PUT Update Statuses

## `PUT /orders/{order}/statuses`

**PUT Update Statuses**

Update the order status or shipping status for an order.

**Required permission:** `orders/manage_statuses`

- **operationId:** `updateOrderStatuses`
- **tags:** Orders

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `order` | path | yes | integer | Order ID |

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "action",
    "statuses"
  ],
  "properties": {
    "action": {
      "type": "string",
      "description": "Status change type: `change_order_status` or `change_shipping_status`",
      "enum": [
        "change_order_status",
        "change_shipping_status"
      ]
    },
    "statuses": {
      "type": "object",
      "description": "Status values object",
      "properties": {
        "order_status": {
          "type": "string",
          "description": "New order status. Required when action is `change_order_status`. One of: `completed`, `processing`, `on-hold`, `canceled`"
        },
        "shipping_status": {
          "type": "string",
          "description": "New shipping status. Required when action is `change_shipping_status`"
        }
      }
    },
    "manage_stock": {
      "type": "boolean",
      "description": "Whether to adjust stock levels on status change"
    }
  },
  "example": {
    "action": "change_order_status",
    "statuses": {
      "order_status": "processing"
    },
    "manage_stock": true
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Status updated successfully. |
| `400` | Bad request. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`orders/manage_statuses`). |
| `422` | Validation failed, or the referenced record does not exist. |
