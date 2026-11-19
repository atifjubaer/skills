# PUT Update Notification

## `PUT /email-notification/{notification}`

**PUT Update Notification**

Update an email notification template's settings including subject, body content, and active status.

**Access policy:** `StoreSensitivePolicy`

**Access policy:** `StoreSensitivePolicy`

- **operationId:** `updateEmailNotification`
- **tags:** Email Notifications

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `notification` | path | yes | string | The notification key (e.g., order_paid_customer) |

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "settings"
  ],
  "properties": {
    "settings": {
      "type": "object",
      "required": [
        "subject"
      ],
      "properties": {
        "subject": {
          "type": "string",
          "maxLength": 255,
          "description": "Email subject line. Supports shortcodes like {{order.invoice_no}}",
          "example": "Your Order #{{order.invoice_no}} is Confirmed!"
        },
        "email_body": {
          "type": "string",
          "nullable": true,
          "description": "Custom email body content (HTML). Sanitized with wp_kses_post",
          "example": "<p>Thank you for your purchase, {{order.billing.first_name}}!</p>"
        },
        "active": {
          "type": "string",
          "enum": [
            "yes",
            "no"
          ],
          "nullable": true,
          "description": "Enable or disable the notification",
          "example": "yes"
        },
        "is_default_body": {
          "type": "string",
          "enum": [
            "yes",
            "no"
          ],
          "nullable": true,
          "description": "Whether to use the default template body. When set to yes, the custom email_body is cleared",
          "example": "no"
        }
      }
    }
  },
  "example": {
    "settings": {
      "subject": "Your Order #{{order.invoice_no}} is Confirmed!",
      "email_body": "<p>Thank you for your purchase, {{order.billing.first_name}}!</p>",
      "active": "yes",
      "is_default_body": "no"
    }
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Notification updated successfully |
| `400` | Bad request or update failed |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `422` | Validation failed, or the referenced record does not exist. |
