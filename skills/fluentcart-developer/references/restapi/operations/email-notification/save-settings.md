# POST Save Global Email Settings

## `POST /email-notification/save-settings`

**POST Save Global Email Settings**

Update the global email configuration settings for all notification emails.

**Access policy:** `StoreSensitivePolicy`

**Access policy:** `StoreSensitivePolicy`

- **operationId:** `saveEmailSettings`
- **tags:** Email Notifications

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "from_name",
    "from_email",
    "admin_email"
  ],
  "properties": {
    "from_name": {
      "type": "string",
      "maxLength": 255,
      "description": "Sender name displayed in emails (max 255 characters)",
      "example": "TechStore"
    },
    "from_email": {
      "type": "string",
      "format": "email",
      "maxLength": 255,
      "description": "Sender email address (must be valid email, max 255 characters)",
      "example": "orders@example.com"
    },
    "reply_to_name": {
      "type": "string",
      "maxLength": 255,
      "nullable": true,
      "description": "Reply-to name (max 255 characters)",
      "example": "TechStore Support"
    },
    "reply_to_email": {
      "type": "string",
      "format": "email",
      "maxLength": 255,
      "nullable": true,
      "description": "Reply-to email address (must be valid email, max 255 characters)",
      "example": "support@example.com"
    },
    "email_footer": {
      "type": "string",
      "nullable": true,
      "description": "HTML content for the email footer. Sanitized with wp_kses_post",
      "example": "<p>&copy; 2025 TechStore Inc. All rights reserved.</p>"
    },
    "admin_email": {
      "type": "string",
      "description": "Admin notification recipient email(s). Supports shortcodes like {{wp.admin_email}}",
      "example": "admin@example.com"
    },
    "show_email_footer": {
      "type": "string",
      "enum": [
        "yes",
        "no"
      ],
      "nullable": true,
      "description": "Show or hide the email footer. On free plans, this is always forced to yes",
      "example": "yes"
    }
  },
  "example": {
    "from_name": "TechStore",
    "from_email": "orders@example.com",
    "reply_to_name": "TechStore Support",
    "reply_to_email": "support@example.com",
    "email_footer": "<p>&copy; 2025 TechStore Inc. All rights reserved.</p>",
    "admin_email": "admin@example.com",
    "show_email_footer": "yes"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Settings saved successfully |
| `400` | Bad request or save failed |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `422` | Validation failed, or the referenced record does not exist. |
