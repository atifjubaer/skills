# POST Skip Next Renewal Period

## `POST /orders/{order}/subscriptions/{subscription}/skip-renewal`

**POST Skip Next Renewal Period**

Advance a store-billed (manual or auto-charge) subscription's `next_billing_date` to the following period without creating or charging a renewal for the current one. Only valid for active or trialing subscriptions with an upcoming billing date. The skip does not stack — if a skip is already pending, or there is nothing left to advance, the request fails.

**Required permission:** `subscriptions/manage`

- **operationId:** `skipRenewal`
- **tags:** Orders

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `order` | path | yes | integer | Parent order ID the subscription belongs to. |
| `subscription` | path | yes | integer | Subscription ID. |

### Request body

`application/json`

```json
{
  "type": "object",
  "properties": {
    "reason": {
      "type": "string",
      "description": "Optional note recorded against the skip."
    }
  },
  "example": {
    "reason": "Customer requested a one-cycle pause"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Billing period skipped successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `404` | The 404 fires for whichever route-bound model resolves first: `order` or `subscription`. No order matches the given ID. Thrown by the framework's route-model-binding, not an explicit controller check, so the message is generic and names the model class. |
| `422` | The subscription is not eligible to skip a period right now (wrong billing type, status, no upcoming date, or a skip is already pending). |
