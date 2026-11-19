# POST Initiate Early Payment

## `POST /customer-profile/subscriptions/{subscription_uuid}/initiate-early-payment`

**POST Initiate Early Payment**

Generate a checkout URL for paying remaining installments early on an installment-based subscription. Requires Pro license, early payment feature enabled, finite installments with remaining payments, and active or trialing status.

**Access policy:** `CustomerFrontendPolicy`

**Access policy:** `CustomerFrontendPolicy`

- **operationId:** `initiateEarlyPayment`
- **tags:** Subscriptions

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `subscription_uuid` | path | yes | string | The subscription UUID (alphanumeric with dashes) |

### Responses

| Status | Description |
| --- | --- |
| `200` | Early payment URL generated successfully |
| `400` | Early payment not available |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `404` | Customer or subscription not found |
| `422` | Validation failed, or the referenced record does not exist. |
