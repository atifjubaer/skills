# PUT Update Transaction Status

## `PUT /orders/{order}/transactions/{transaction}/status`

**PUT Update Transaction Status**

Update the payment status of a specific transaction and sync the order's payment status accordingly.

**Required permission:** `orders/manage`

- **operationId:** `updateTransactionStatus`
- **tags:** Orders

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `order` | path | yes | integer | Order ID |
| `transaction` | path | yes | integer | Transaction ID |

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "status"
  ],
  "properties": {
    "status": {
      "type": "string",
      "description": "New transaction status (e.g., `succeeded`, `pending`, `refunded`, `failed`)"
    }
  },
  "example": {
    "status": "succeeded"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Transaction status updated successfully. |
| `400` | Bad request. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`orders/manage`). |
| `422` | Validation failed, or the referenced record does not exist. |
