# GET Get Shortcodes

## `GET /email-notification/get-short-codes`

**GET Get Shortcodes**

Retrieve available shortcodes, email template files, and editor buttons for the email notification editor.

**Access policy:** `StoreSensitivePolicy`

**Access policy:** `StoreSensitivePolicy`

- **operationId:** `getEmailShortcodes`
- **tags:** Email Notifications

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
