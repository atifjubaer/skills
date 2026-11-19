# POST Cancel Auto-Renew

## `POST /customer-profile/subscriptions/{subscription_uuid}/cancel-auto-renew`

**POST Cancel Auto-Renew**

Cancel auto-renewal for a subscription from the customer portal. The subscription is cancelled both locally and with the remote payment gateway. The cancellation reason is automatically set to cancelled_by_customer.

**Access policy:** `CustomerFrontendPolicy`

**Access policy:** `CustomerFrontendPolicy`

- **operationId:** `cancelAutoRenew`
- **tags:** Subscriptions

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `subscription_uuid` | path | yes | string | The subscription UUID (alphanumeric with dashes) |

### Responses

| Status | Description |
| --- | --- |
| `200` | Auto-renewal cancelled successfully |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `404` | Customer or subscription not found |
| `422` | Validation failed, or the referenced record does not exist. |
