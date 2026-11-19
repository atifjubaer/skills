# POST Save Confirmation Settings

## `POST /settings/confirmation`

**POST Save Confirmation Settings**

Update the order confirmation/receipt page settings, including the confirmation type, message content, and the receipt page assignment.

**Required permission:** `is_super_admin`

- **operationId:** `saveConfirmationSettings`
- **tags:** Settings

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
      "description": "Confirmation settings object.",
      "properties": {
        "confirmation_type": {
          "type": "string",
          "description": "Confirmation behavior: `same_page` (show confirmation on same page) or `custom_page` (redirect to a custom page).",
          "enum": [
            "same_page",
            "custom_page"
          ],
          "example": "custom_page"
        },
        "message_to_show": {
          "type": "string",
          "description": "HTML content to display as the order confirmation message. Sanitized with `wp_kses_post`.",
          "example": "<h2>Order Confirmed!</h2><p>Thank you for your purchase.</p>"
        },
        "confirmation_page_id": {
          "type": "integer",
          "description": "WordPress page ID for a custom confirmation/receipt page. Also updates the store's `receipt_page_id`.",
          "example": 42
        }
      }
    }
  },
  "example": {
    "settings": {
      "confirmation_type": "custom_page",
      "confirmation_page_id": 42,
      "message_to_show": "<h2>Order Confirmed!</h2><p>Thank you for your purchase.</p>"
    }
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`is_super_admin`). |
| `422` | Validation failed, or the referenced record does not exist. |
