# POST Accept Dispute

## `POST /orders/{order}/transactions/{transaction_id}/accept-dispute`

**POST Accept Dispute**

Accept a payment dispute (chargeback) for a specific transaction.

**Required permission:** `orders/manage`

- **operationId:** `acceptDispute`
- **tags:** Orders

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `order` | path | yes | integer | Order ID |
| `transaction_id` | path | yes | integer | Transaction ID with the dispute |

### Request body

`application/json`

```json
{
  "type": "object",
  "properties": {
    "dispute_note": {
      "type": "string",
      "description": "Note about the dispute acceptance"
    }
  },
  "example": {
    "dispute_note": "Customer provided valid reason for dispute"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Dispute accepted successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`orders/manage`). |
| `422` | Validation failed, or the referenced record does not exist. |
