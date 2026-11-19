# POST Get or Create Plan

## `POST /customer-profile/subscriptions/{subscription_uuid}/get-or-create-plan`

**POST Get or Create Plan**

Get or create a subscription plan on the remote payment gateway. Typically used during the payment method switch flow to ensure the target gateway has a matching plan configured.

**Access policy:** `CustomerFrontendPolicy`

**Access policy:** `CustomerFrontendPolicy`

- **operationId:** `getOrCreatePlan`
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
          "description": "Target payment gateway slug (e.g., stripe, paypal)",
          "example": "stripe"
        },
        "reason": {
          "type": "string",
          "description": "Reason for creating the plan",
          "example": "switching_payment_method"
        }
      },
      "description": "Plan data object"
    }
  },
  "example": {
    "data": {
      "method": "stripe",
      "reason": "switching_payment_method"
    }
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Plan retrieved or created successfully. Response depends on the gateway's getOrCreateNewPlan implementation. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `422` | Could not get or create plan |
