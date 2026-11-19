# GET Get Email Shortcodes

## `GET /settings/confirmation/shortcode`

**GET Get Email Shortcodes**

Retrieve available shortcodes/merge tags that can be used in email notification templates and confirmation messages.

**Required permission:** `is_super_admin`

- **operationId:** `getEmailShortcodes`
- **tags:** Settings

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`is_super_admin`). |
