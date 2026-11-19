# POST Save Payment Method Settings

## `POST /settings/payment-methods`

**POST Save Payment Method Settings**

Create or update the configuration for a specific payment method gateway.

**Required permission:** `is_super_admin`

- **operationId:** `savePaymentMethodSettings`
- **tags:** Settings

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "method",
    "settings"
  ],
  "properties": {
    "method": {
      "type": "string",
      "description": "The payment method key (e.g., `stripe`, `paypal`, `cod`).",
      "example": "cod"
    },
    "settings": {
      "type": "object",
      "description": "Key-value object of gateway-specific settings to save. Fields vary by payment method.",
      "additionalProperties": true,
      "example": {
        "is_active": "yes",
        "checkout_label": "Cash on Delivery"
      }
    }
  },
  "example": {
    "method": "cod",
    "settings": {
      "is_active": "yes",
      "checkout_label": "Cash on Delivery"
    }
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
