# POST Refund Order

## `POST /orders/{order_id}/refund`

**POST Refund Order**

Process a full or partial refund for an order. Supports both gateway refunds and manual refunds, with optional subscription cancellation.

**Required permission:** `orders/can_refund`

- **operationId:** `refundOrder`
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
    "refund_info"
  ],
  "properties": {
    "refund_info": {
      "type": "object",
      "required": [
        "transaction_id",
        "amount"
      ],
      "description": "Refund details object",
      "properties": {
        "transaction_id": {
          "type": "integer",
          "description": "ID of the transaction to refund"
        },
        "amount": {
          "type": "number",
          "description": "Refund amount in cents, matching every other money value in the API (e.g. 2500 refunds $25.00)."
        },
        "cancelSubscription": {
          "type": "string",
          "description": "Set to `\"true\"` to cancel associated subscription"
        }
      }
    }
  },
  "example": {
    "refund_info": {
      "transaction_id": 15,
      "amount": 2500,
      "cancelSubscription": "true"
    }
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Refund processed successfully. |
| `400` | Order cannot be refunded. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`orders/can_refund`). |
| `422` | Validation error. |
