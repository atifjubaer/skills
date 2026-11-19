# GET List All Notifications

## `GET /email-notification`

**GET List All Notifications**

Retrieve all registered email notification templates with their current configuration. Returns both default and customized notification settings for orders, subscriptions, and scheduler/reminder actions.

**Access policy:** `StoreSensitivePolicy`

- **operationId:** `listEmailNotifications`
- **tags:** Email Notifications

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
