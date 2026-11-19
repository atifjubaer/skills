# POST Mark Order as Paid

## `POST /orders/{order}/mark-as-paid`

**POST Mark Order as Paid**

Mark a pending order as paid, creating or updating the transaction record.

**Required permission:** `orders/manage`

- **operationId:** `markOrderAsPaid`
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
  "properties": {
    "payment_method": {
      "type": "string",
      "description": "Payment method used (e.g., `offline_payment`, `stripe`)"
    },
    "vendor_charge_id": {
      "type": "string",
      "description": "External payment reference/charge ID"
    },
    "transaction_type": {
      "type": "string",
      "description": "Transaction type identifier"
    },
    "mark_paid_note": {
      "type": "string",
      "description": "Note to attach to the order"
    }
  },
  "example": {
    "payment_method": "offline_payment",
    "vendor_charge_id": "CHK-12345",
    "mark_paid_note": "Payment received via bank transfer"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Order marked as paid successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`orders/manage`). |
| `422` | Validation failed, or the referenced record does not exist. |
| `423` | Order cannot be marked as paid. |
