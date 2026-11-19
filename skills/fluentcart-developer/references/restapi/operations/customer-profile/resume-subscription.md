# POST Resume Subscription

## `POST /customer-profile/subscriptions/{subscription_uuid}/resume`

**POST Resume Subscription**

Resume the logged-in customer's own paused subscription from the customer portal. The subscription must belong to the currently authenticated customer and is looked up by its UUID, not its numeric ID.

**Access policy:** `CustomerFrontendPolicy`

**Access policy:** `CustomerFrontendPolicy`

- **operationId:** `resumeSubscription`
- **tags:** Customer Profile

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `subscription_uuid` | path | yes | string | UUID of the subscription to resume. Must belong to the currently authenticated customer. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Subscription resumed successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `422` | The requester is not logged in, has no customer record, the subscription UUID does not belong to them, or the subscription cannot be resumed in its current state (the error message reflects which case occurred). |
