# POST Confirm Subscription Switch

## `POST /customer-profile/subscriptions/{subscription_uuid}/confirm-subscription-switch`

**POST Confirm Subscription Switch**

Confirm a two-step payment method switch. After the initial switch-payment-method call creates a new subscription on the target gateway, this endpoint finalizes the switch by confirming the new subscription and deactivating the old one.

**Access policy:** `CustomerFrontendPolicy`

**Access policy:** `CustomerFrontendPolicy`

- **operationId:** `confirmSubscriptionSwitch`
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
        "newVendorSubscriptionId",
        "method"
      ],
      "properties": {
        "newVendorSubscriptionId": {
          "type": "string",
          "description": "The new subscription ID from the target payment gateway",
          "example": "I-WX9Y8Z7A6B5C"
        },
        "method": {
          "type": "string",
          "description": "The target payment gateway slug",
          "example": "paypal"
        }
      },
      "description": "Confirmation data. Additional fields depend on the specific payment gateway implementation."
    }
  },
  "example": {
    "data": {
      "newVendorSubscriptionId": "I-WX9Y8Z7A6B5C",
      "method": "paypal"
    }
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Subscription switch confirmed successfully. Response depends on the gateway's confirmSubscriptionSwitch implementation. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `422` | Could not confirm subscription switch |
