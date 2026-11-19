# POST Switch Payment Method

## `POST /customer-profile/subscriptions/{subscription_uuid}/switch-payment-method`

**POST Switch Payment Method**

Switch a subscription's payment method from one gateway to another (e.g., from Stripe to PayPal). This initiates the switch process, which may require a confirmation step depending on the target gateway.

**Access policy:** `CustomerFrontendPolicy`

**Access policy:** `CustomerFrontendPolicy`

- **operationId:** `switchPaymentMethod`
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
        "newPaymentMethod",
        "currentPaymentMethod"
      ],
      "properties": {
        "newPaymentMethod": {
          "type": "string",
          "description": "Target payment gateway slug",
          "example": "paypal"
        },
        "currentPaymentMethod": {
          "type": "string",
          "description": "Current payment gateway slug",
          "example": "stripe"
        }
      },
      "description": "Payment method switch data. Additional fields depend on the specific payment gateway implementation."
    }
  },
  "example": {
    "data": {
      "newPaymentMethod": "paypal",
      "currentPaymentMethod": "stripe"
    }
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Switch initiated successfully. Response depends on the gateway's switchPaymentMethod implementation. May return a redirect URL or client secret for the new gateway. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `422` | Could not switch payment method |
