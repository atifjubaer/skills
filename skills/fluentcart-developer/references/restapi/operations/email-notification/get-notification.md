# GET Get Single Notification

## `GET /email-notification/{notification}`

**GET Get Single Notification**

Retrieve a single email notification template by its name, along with available shortcodes for the email editor.

**Access policy:** `StoreSensitivePolicy`

**Access policy:** `StoreSensitivePolicy`

- **operationId:** `getEmailNotification`
- **tags:** Email Notifications

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `notification` | path | yes | string | The notification key (e.g., order_paid_customer, subscription_renewal_admin) |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `404` | Notification not found |
| `422` | Validation failed, or the referenced record does not exist. |
