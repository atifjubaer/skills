# GET Get Scheduling Settings

## `GET /email-notification/reminders`

**GET Get Scheduling Settings**

Retrieve reminder/scheduling settings for automated email notifications such as payment reminders, renewal reminders, and trial-end reminders. Returns both the current settings and the form field definitions for the reminders tab.

**Access policy:** `StoreSensitivePolicy`

**Access policy:** `StoreSensitivePolicy`

- **operationId:** `getSchedulingSettings`
- **tags:** Email Notifications

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
