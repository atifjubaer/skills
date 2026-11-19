# POST Update Payment Method

## `POST /customer-profile/subscriptions/{subscription_uuid}/update-payment-method`

**POST Update Payment Method**

Update the payment method (e.g., replace the card on file) for an existing subscription within the same payment gateway.

**Access policy:** `CustomerFrontendPolicy`

**Access policy:** `CustomerFrontendPolicy`

- **operationId:** `updatePaymentMethod`
- **tags:** Subscriptions

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `subscription_uuid` | path | yes | string | The subscription UUID (alphanumeric with dashes) |

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "data"
  ],
  "properties": {
    "data": {
      "type": "object",
      "required": [
        "method"
      ],
      "properties": {
        "method": {
          "type": "string",
          "description": "Payment gateway slug (e.g., stripe, paypal)",
          "example": "stripe"
        },
        "payment_method_id": {
          "type": "string",
          "description": "Gateway-specific payment method identifier",
          "example": "pm_1Px8KLMnOpQr"
        }
      },
      "description": "Payment method data object. Additional fields depend on the specific payment gateway implementation."
    }
  },
  "example": {
    "data": {
      "method": "stripe",
      "payment_method_id": "pm_1Px8KLMnOpQr"
    }
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Payment method updated successfully. Response depends on the gateway's cardUpdate implementation. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `422` | Could not update payment method |
