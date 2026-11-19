# POST Disconnect Payment Method

## `POST /settings/payment-methods/disconnect`

**POST Disconnect Payment Method**

Disconnect a payment gateway account (e.g., revoke Stripe or PayPal connection).

**Required permission:** `is_super_admin`

- **operationId:** `disconnectPaymentMethod`
- **tags:** Settings

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "method",
    "mode"
  ],
  "properties": {
    "method": {
      "type": "string",
      "description": "The payment method key to disconnect (e.g., `stripe`, `paypal`).",
      "example": "paypal"
    },
    "mode": {
      "type": "string",
      "description": "The environment mode to disconnect: `test` or `live`.",
      "enum": [
        "test",
        "live"
      ],
      "example": "test"
    }
  },
  "example": {
    "method": "paypal",
    "mode": "test"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`is_super_admin`). |
| `422` | Validation failed, or the referenced record does not exist. |
