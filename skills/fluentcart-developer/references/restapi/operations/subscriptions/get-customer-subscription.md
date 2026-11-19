# GET Get Customer Subscription Details

## `GET /customer-profile/subscriptions/{subscription_uuid}`

**GET Get Customer Subscription Details**

Retrieve full details of a specific subscription for the currently logged-in customer, including transactions, upgrade eligibility, and payment method capabilities.

**Access policy:** `CustomerFrontendPolicy`

- **operationId:** `getCustomerSubscription`
- **tags:** Subscriptions

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `subscription_uuid` | path | yes | string | The subscription UUID (alphanumeric with dashes) |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response with full subscription details including transactions, upgrade eligibility, and payment method capabilities. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `422` | Validation failed, or the referenced record does not exist. |
