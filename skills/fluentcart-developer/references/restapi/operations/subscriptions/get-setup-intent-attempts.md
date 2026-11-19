# GET Get Setup Intent Remaining Attempts

## `GET /customer-profile/subscriptions/{subscription_uuid}/setup-intent-attempts`

**GET Get Setup Intent Remaining Attempts**

Check how many Stripe SetupIntent attempts remain for the customer. Used to enforce rate limiting on payment method update attempts. Only works when the subscription's current_payment_method is stripe.

**Access policy:** `CustomerFrontendPolicy`

**Access policy:** `CustomerFrontendPolicy`

- **operationId:** `getSetupIntentAttempts`
- **tags:** Subscriptions

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `subscription_uuid` | path | yes | string | The subscription UUID (alphanumeric with dashes) |

### Responses

| Status | Description |
| --- | --- |
| `200` | Returns the number of remaining setup intent attempts |
| `400` | Payment method not supported (non-Stripe subscription) |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `422` | Validation failed, or the referenced record does not exist. |
