# GET Get Single Transaction

## `GET /orders/{id}/transactions/{transaction_id}`

**GET Get Single Transaction**

Retrieve details of a specific transaction within an order. Returns the full order details (same as Get Order Details).

**Required permission:** `orders/view`

- **operationId:** `getSingleTransaction`
- **tags:** Orders

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `id` | path | yes | integer | Order ID |
| `transaction_id` | path | yes | integer | Transaction ID |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns full order details. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`orders/view`). |
| `422` | Validation failed, or the referenced record does not exist. |
