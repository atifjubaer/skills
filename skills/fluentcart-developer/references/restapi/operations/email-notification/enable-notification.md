# POST Enable/Disable Notification

## `POST /email-notification/enable-notification/{name}`

**POST Enable/Disable Notification**

Toggle a notification template on or off without modifying other settings.

**Access policy:** `StoreSensitivePolicy`

**Access policy:** `StoreSensitivePolicy`

- **operationId:** `enableEmailNotification`
- **tags:** Email Notifications

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `name` | path | yes | string | The notification key (e.g., order_paid_admin) |

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "active"
  ],
  "properties": {
    "active": {
      "type": "string",
      "enum": [
        "yes",
        "no"
      ],
      "description": "Set to yes to enable or no to disable the notification",
      "example": "yes"
    }
  },
  "example": {
    "active": "yes"
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
