# POST Send Manual Reminder

## `POST /email-notification/send-manual-reminder`

**POST Send Manual Reminder**

Manually trigger a reminder email for a single entity (for example, a subscription payment reminder) outside of its normal scheduled trigger.

**Access policy:** `StoreSensitivePolicy`

**Access policy:** `StoreSensitivePolicy`

- **operationId:** `sendManualReminder`
- **tags:** Email Notifications

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "event",
    "entity_id"
  ],
  "properties": {
    "event": {
      "type": "string",
      "description": "The reminder event type to send."
    },
    "entity_id": {
      "type": "integer",
      "description": "ID of the entity (e.g. subscription ID) the reminder relates to."
    }
  },
  "example": {
    "event": "subscription_payment_reminder",
    "entity_id": 15
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Reminder sent successfully. |
| `401` | Unauthenticated. |
| `403` | The authenticated user lacks store-sensitive access. |
| `422` | Missing event/entity_id, or the reminder could not be sent for the given entity. |
