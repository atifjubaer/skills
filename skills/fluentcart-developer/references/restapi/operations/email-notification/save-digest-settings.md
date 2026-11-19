# POST Save Store Digest Settings

## `POST /email-notification/digest-settings`

**POST Save Store Digest Settings**

Save the store's digest email settings. The `enabled` master flag is derived server-side — it is set to "yes" automatically whenever any of the daily, weekly, or monthly cadences are enabled, and cannot be set directly.

**Access policy:** `StoreSensitivePolicy`

**Access policy:** `StoreSensitivePolicy`

- **operationId:** `saveDigestSettings`
- **tags:** Email Notifications

### Request body

`application/json`

```json
{
  "type": "object",
  "properties": {
    "recipients": {
      "type": "string",
      "description": "Comma-separated recipient list, or a template like {{wp.admin_email}}. Defaults to {{wp.admin_email}} if omitted."
    },
    "send_when_empty": {
      "type": "string",
      "description": "\"yes\" to send a digest even when there's no activity to report; anything else is treated as \"no\"."
    },
    "daily": {
      "type": "object",
      "properties": {
        "enabled": {
          "type": "string",
          "description": "\"yes\" to enable the daily digest; anything else is treated as \"no\"."
        },
        "send_hour": {
          "type": "integer",
          "description": "Hour of day to send, clamped to 0-23."
        }
      }
    },
    "weekly": {
      "type": "object",
      "properties": {
        "enabled": {
          "type": "string"
        },
        "send_hour": {
          "type": "integer",
          "description": "Hour of day to send, clamped to 0-23."
        },
        "send_dow": {
          "type": "integer",
          "description": "Day of week to send, 0-6."
        }
      }
    },
    "monthly": {
      "type": "object",
      "properties": {
        "enabled": {
          "type": "string"
        },
        "send_hour": {
          "type": "integer",
          "description": "Hour of day to send, clamped to 0-23."
        }
      }
    }
  },
  "example": {
    "recipients": "alex.morgan@example.com",
    "send_when_empty": "no",
    "daily": {
      "enabled": "no",
      "send_hour": 8
    },
    "weekly": {
      "enabled": "yes",
      "send_hour": 8,
      "send_dow": 1
    },
    "monthly": {
      "enabled": "no",
      "send_hour": 8
    }
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Digest settings saved successfully. |
| `401` | Unauthenticated. |
| `403` | The authenticated user lacks store-sensitive access. |
| `422` | Validation failed, or the referenced record does not exist. |
