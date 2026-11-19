# POST Setup PayPal Webhook

## `POST /settings/payment-methods/paypal/webhook/setup`

**POST Setup PayPal Webhook**

Register a webhook endpoint with PayPal to receive payment event notifications.

**Required permission:** `super_admin`

- **operationId:** `setupPaypalWebhook`
- **tags:** Settings

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "mode"
  ],
  "properties": {
    "mode": {
      "type": "string",
      "description": "Environment mode: `test` or `live`.",
      "enum": [
        "test",
        "live"
      ],
      "example": "live"
    }
  },
  "example": {
    "mode": "live"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`super_admin`). |
| `422` | Validation failed, or the referenced record does not exist. |
