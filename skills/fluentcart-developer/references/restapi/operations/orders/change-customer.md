# POST Change Customer

## `POST /orders/{order_id}/change-customer`

**POST Change Customer**

Reassign an order to a different existing customer. Updates all connected orders (parent/child/renewals), subscriptions, and customer statistics.

**Required permission:** `orders/manage`

- **operationId:** `changeCustomer`
- **tags:** Orders

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `order_id` | path | yes | integer | Order ID |

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "customer_id"
  ],
  "properties": {
    "customer_id": {
      "type": "integer",
      "description": "New customer ID to assign"
    }
  },
  "example": {
    "customer_id": 15
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Customer changed successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`orders/manage`). |
| `422` | Validation failed, or the referenced record does not exist. |
| `423` | Validation error. |
