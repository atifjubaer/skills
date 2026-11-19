# PUT Update Subscription

## `PUT /orders/{order}/subscriptions/{subscription}/update`

**PUT Update Subscription**

Update a manual subscription's billing details — recurring amount, remaining bill count, billing interval, status, or next billing date. Only subscriptions with a manual collection method can be updated through this endpoint; system (auto-charge) and gateway-managed subscriptions are rejected. Note `recurring_total` is submitted as a decimal amount in the store's currency (e.g. `29.99`), not cents, unlike most other money fields in this API.

**Required permission:** `subscriptions/manage`

- **operationId:** `updateSubscription`
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
  "required": [
    "status"
  ],
  "properties": {
    "status": {
      "type": "string",
      "enum": [
        "active",
        "paused",
        "trialing",
        "canceled",
        "expired",
        "completed",
        "past_due"
      ],
      "description": "New subscription status."
    },
    "recurring_total": {
      "type": "number",
      "minimum": 0,
      "description": "New recurring amount, as a decimal in the store's currency (e.g. 29.99) — not cents."
    },
    "bill_times": {
      "type": "integer",
      "minimum": 0,
      "description": "Number of remaining billing cycles."
    },
    "billing_interval": {
      "type": "string",
      "maxLength": 100,
      "description": "Billing interval label (e.g. monthly, yearly)."
    },
    "next_billing_date": {
      "type": "string",
      "maxLength": 25,
      "description": "Next billing date. Any string `strtotime()` can parse."
    }
  },
  "example": {
    "status": "active",
    "recurring_total": 29.99,
    "bill_times": 0,
    "billing_interval": "monthly",
    "next_billing_date": "2026-09-18 00:00:00"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Subscription updated successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `404` | The 404 fires for whichever route-bound model resolves first: `order` or `subscription`. No order matches the given ID. Thrown by the framework's route-model-binding, not an explicit controller check, so the message is generic and names the model class. |
| `422` | Validation failed (e.g. missing/invalid status, or the subscription is not manual and cannot be updated). |
