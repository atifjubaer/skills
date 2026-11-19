# PUT Cancel Subscription

## `PUT /orders/{order}/subscriptions/{subscription}/cancel`

**PUT Cancel Subscription**

Cancel a subscription both locally and with the remote payment gateway.

**Required permission:** `subscriptions/manage`

- **operationId:** `cancelSubscription`
- **tags:** Subscriptions

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `order` | path | yes | integer | The parent order ID |
| `subscription` | path | yes | integer | The subscription ID |

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "cancel_reason"
  ],
  "properties": {
    "cancel_reason": {
      "type": "string",
      "description": "Reason for cancellation. Sanitized with sanitize_text_field.",
      "example": "Customer requested cancellation"
    }
  },
  "example": {
    "cancel_reason": "Customer requested cancellation"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Subscription cancelled successfully |
| `400` | Bad request - missing cancel reason or remote failure |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`subscriptions/manage`). |
| `422` | Validation failed, or the referenced record does not exist. |
