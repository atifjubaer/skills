# DELETE Delete Order

## `DELETE /orders/{order_id}`

**DELETE Delete Order**

Permanently delete an order and all associated data (transactions, items, meta, addresses, coupons, cart data, download permissions, labels). For subscription orders, also deletes all child renewal orders and subscriptions.

**Required permission:** `orders/delete`

- **operationId:** `deleteOrder`
- **tags:** Orders

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `order_id` | path | yes | integer | Order ID to delete |

### Responses

| Status | Description |
| --- | --- |
| `200` | Order deleted successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`orders/delete`). |
| `404` | Order not found. |
| `422` | Validation failed, or the referenced record does not exist. |
