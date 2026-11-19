# POST Preview Notification

## `POST /email-notification/preview`

**POST Preview Notification**

Generate an HTML preview of a custom email notification template. Uses the block editor email body from the notification's saved settings, parses it through the block parser, wraps it in the email template layout, and resolves shortcodes using real or fallback order data.

**Policy:** `StoreSensitivePolicy`

- **operationId:** `previewEmailNotification`
- **tags:** Email Notifications

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "notification_name"
  ],
  "properties": {
    "notification_name": {
      "type": "string",
      "description": "The notification key to preview (e.g., order_paid_customer)",
      "example": "order_paid_customer"
    },
    "order_id": {
      "type": "integer",
      "nullable": true,
      "description": "Specific order ID to use for shortcode data. If not provided or not found, the most recent order is used",
      "example": 42
    }
  },
  "example": {
    "notification_name": "order_paid_customer",
    "order_id": 42
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response with rendered HTML |
| `400` | Bad request - missing or invalid notification name |
| `404` | Notification not found |
