# GET Get Global Email Settings

## `GET /email-notification/get-settings`

**GET Get Global Email Settings**

Retrieve the global email configuration settings used across all notification emails (sender name, email addresses, footer, etc.).

**Access policy:** `StoreSensitivePolicy`

**Access policy:** `StoreSensitivePolicy`

- **operationId:** `getEmailSettings`
- **tags:** Email Notifications

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
