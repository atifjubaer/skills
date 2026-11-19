# POST Void Renewal Invoice

## `POST /renewals/{order}/void`

**POST Void Renewal Invoice**

Cancel a pending or scheduled renewal invoice. Sets the order's payment_status to failed and status to canceled, fails any pending transactions on it, advances the subscription past this billing period so the scheduler doesn't immediately regenerate the same invoice, and recounts the customer's stats. If the invoice was paid by a concurrent webhook between validation and the update, the void is rejected instead of overwriting a paid invoice.

**Required permission:** `orders/manage`

- **operationId:** `void`
- **tags:** Orders

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `order` | path | yes | integer | Renewal order ID |

### Responses

| Status | Description |
| --- | --- |
| `200` | Renewal invoice voided. |
| `400` | Order is not a renewal, or is not pending/scheduled. |
| `401` | Authentication required. |
| `403` | The current user lacks the orders/manage permission. |
| `404` | No order matches the given ID. Thrown by the framework's route-model-binding, not an explicit controller check, so the message is generic and names the model class. |
| `409` | The invoice was paid by a concurrent webhook and can no longer be voided. |
| `422` | Validation failed, or the referenced record does not exist. |
