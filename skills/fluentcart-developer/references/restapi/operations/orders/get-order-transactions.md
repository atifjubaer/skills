# GET Get Order Transactions

## `GET /orders/{order}/transactions`

**GET Get Order Transactions**

Retrieve all transactions for an order. Returns the full order details (same as Get Order Details), which includes the transactions relation.

**Required permission:** `orders/view`

- **operationId:** `getOrderTransactions`
- **tags:** Orders

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `order` | path | yes | integer | Order ID |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns full order details with transactions. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`orders/view`). |
| `422` | Validation failed, or the referenced record does not exist. |
