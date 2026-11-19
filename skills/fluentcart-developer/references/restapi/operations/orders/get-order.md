# GET Get Order Details

## `GET /orders/{order_id}`

**GET Get Order Details**

Retrieve detailed information about a specific order, including items, transactions, addresses, subscriptions, and activities.

**Required permission:** `orders/view`

- **operationId:** `getOrder`
- **tags:** Orders

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `order_id` | path | yes | integer | Order ID |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns detailed order information. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`orders/view`). |
| `422` | Validation failed, or the referenced record does not exist. |
