# POST Preview Default Template

## `POST /email-notification/preview-default-template`

**POST Preview Default Template**

Generate an HTML preview of a default (built-in) email template. Unlike the custom block editor preview, this renders the PHP-based default template using dummy preview data, wrapped in the standard email layout with header and footer.

**Access policy:** `StoreSensitivePolicy`

**Access policy:** `StoreSensitivePolicy`

- **operationId:** `previewDefaultTemplate`
- **tags:** Email Notifications

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "template"
  ],
  "properties": {
    "template": {
      "type": "string",
      "description": "The template path name to preview. Corresponds to the template_path value from the notification configuration",
      "enum": [
        "order.paid.admin",
        "order.paid.customer",
        "order.refunded.admin",
        "order.refunded.customer",
        "order.shipped.customer",
        "order.delivered.customer",
        "order.placed.admin",
        "order.placed.customer",
        "order.reminder.overdue.customer",
        "order.reminder.overdue.admin",
        "subscription.renewal.customer",
        "subscription.renewal.admin",
        "subscription.canceled.customer",
        "subscription.canceled.admin",
        "subscription.reminder.customer",
        "subscription.reminder.admin",
        "subscription.trial_end.customer",
        "subscription.trial_end.admin"
      ],
      "example": "order.paid.customer"
    }
  },
  "example": {
    "template": "order.paid.customer"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response with rendered HTML |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `422` | Validation failed, or the referenced record does not exist. |
