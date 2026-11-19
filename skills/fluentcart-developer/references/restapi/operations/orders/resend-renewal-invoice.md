# POST Resend Renewal Invoice Email

## `POST /renewals/{order}/resend`

**POST Resend Renewal Invoice Email**

Resend the pay-now email notification for a pending renewal invoice. Only allowed for renewal orders with `payment_status = pending`. If the invoice belongs to a system (store-managed) subscription that is still mid-retry, the resend is blocked until the automatic retry ladder is exhausted, so it never overlaps the dunning emails.

**Required permission:** `orders/manage`

- **operationId:** `resend`
- **tags:** Orders

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `order` | path | yes | integer | Renewal order ID |

### Responses

| Status | Description |
| --- | --- |
| `200` | Renewal invoice email resent. |
| `400` | Order is not a renewal, is not pending, or its automatic retries have not yet exhausted. |
| `401` | Authentication required. |
| `403` | The current user lacks the orders/manage permission. |
| `404` | No order matches the given ID. Thrown by the framework's route-model-binding (`Order::firstOrFail()`), not an explicit controller check, so the message is generic. |
| `422` | Validation failed, or the referenced record does not exist. |
