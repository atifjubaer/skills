# POST Send Test Digest Email

## `POST /email-notification/digest-settings/send-test`

**POST Send Test Digest Email**

Send a one-off test digest email for the given cadence, using the store's currently configured digest recipients (falling back to the WordPress admin email if none are configured).

**Access policy:** `StoreSensitivePolicy`

**Access policy:** `StoreSensitivePolicy`

- **operationId:** `sendDigestTest`
- **tags:** Email Notifications

### Request body

`application/json`

```json
{
  "type": "object",
  "properties": {
    "frequency": {
      "type": "string",
      "description": "One of: daily, weekly, monthly. Falls back to \"daily\" if omitted or not a recognized cadence.",
      "enum": [
        "daily",
        "weekly",
        "monthly"
      ]
    }
  },
  "example": {
    "frequency": "weekly"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Test digest email sent successfully. |
| `401` | Unauthenticated. |
| `403` | The authenticated user lacks store-sensitive access. |
| `422` | The test email could not be sent (e.g. no valid mailer/recipients configured). |
