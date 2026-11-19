# POST Exchange PayPal Seller Auth Token

## `POST /settings/payment-methods/paypal/seller-auth-token`

**POST Exchange PayPal Seller Auth Token**

Exchange the PayPal authorization code for a seller access token during the PayPal Connect onboarding flow. This retrieves merchant credentials and saves them to the gateway settings.

**Required permission:** `super_admin`

- **operationId:** `exchangePaypalSellerAuthToken`
- **tags:** Settings

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "authCode",
    "sharedId",
    "mode"
  ],
  "properties": {
    "authCode": {
      "type": "string",
      "description": "The authorization code received from PayPal OAuth redirect.",
      "example": "C21AAF..."
    },
    "sharedId": {
      "type": "string",
      "description": "The PayPal partner shared/client ID used during authentication.",
      "example": "AaBbCc..."
    },
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
    "authCode": "C21AAF...",
    "sharedId": "AaBbCc...",
    "mode": "live"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Credentials are saved to the PayPal gateway settings and webhooks are automatically registered. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`super_admin`). |
| `422` | Validation failed, or the referenced record does not exist. |
