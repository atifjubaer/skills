# POST Save Scheduling Settings

## `POST /email-notification/reminders`

**POST Save Scheduling Settings**

Update reminder/scheduling settings for automated email notifications. Each reminder type has an enable toggle and a days configuration that controls how many days before the event the reminder is sent.

**Access policy:** `StoreSensitivePolicy`

**Access policy:** `StoreSensitivePolicy`

- **operationId:** `saveSchedulingSettings`
- **tags:** Email Notifications

### Request body

`application/json`

```json
{
  "type": "object",
  "properties": {
    "reminders_enabled": {
      "type": "string",
      "enum": [
        "yes",
        "no"
      ],
      "description": "Master toggle for all reminders",
      "example": "yes"
    },
    "invoice_reminders_enabled": {
      "type": "string",
      "enum": [
        "yes",
        "no"
      ],
      "description": "Enable invoice payment reminders",
      "example": "yes"
    },
    "invoice_reminder_due_days": {
      "type": "integer",
      "minimum": 0,
      "maximum": 365,
      "description": "Days before due date to send invoice reminder. Required when invoice_reminders_enabled is yes",
      "example": 3
    },
    "invoice_reminder_overdue_days": {
      "type": "string",
      "description": "Comma-separated day intervals for overdue reminders (e.g., 1,3,7)",
      "example": "1,3,7"
    },
    "yearly_renewal_reminders_enabled": {
      "type": "string",
      "enum": [
        "yes",
        "no"
      ],
      "description": "Enable yearly subscription renewal reminders",
      "example": "yes"
    },
    "yearly_renewal_reminder_days": {
      "type": "integer",
      "minimum": 7,
      "maximum": 90,
      "description": "Days before renewal to send reminder. Required when yearly_renewal_reminders_enabled is yes",
      "example": 30
    },
    "trial_end_reminders_enabled": {
      "type": "string",
      "enum": [
        "yes",
        "no"
      ],
      "description": "Enable trial ending reminders",
      "example": "yes"
    },
    "trial_end_reminder_days": {
      "type": "integer",
      "minimum": 1,
      "maximum": 14,
      "description": "Days before trial ends to send reminder. Required when trial_end_reminders_enabled is yes",
      "example": 3
    },
    "monthly_renewal_reminders_enabled": {
      "type": "string",
      "enum": [
        "yes",
        "no"
      ],
      "description": "Enable monthly renewal reminders",
      "example": "no"
    },
    "monthly_renewal_reminder_days": {
      "type": "integer",
      "minimum": 3,
      "maximum": 28,
      "description": "Days before renewal to send reminder. Required when monthly_renewal_reminders_enabled is yes",
      "example": 7
    },
    "quarterly_renewal_reminders_enabled": {
      "type": "string",
      "enum": [
        "yes",
        "no"
      ],
      "description": "Enable quarterly renewal reminders",
      "example": "no"
    },
    "quarterly_renewal_reminder_days": {
      "type": "integer",
      "minimum": 7,
      "maximum": 60,
      "description": "Days before renewal to send reminder. Required when quarterly_renewal_reminders_enabled is yes",
      "example": 14
    },
    "half_yearly_renewal_reminders_enabled": {
      "type": "string",
      "enum": [
        "yes",
        "no"
      ],
      "description": "Enable half-yearly renewal reminders",
      "example": "no"
    },
    "half_yearly_renewal_reminder_days": {
      "type": "integer",
      "minimum": 7,
      "maximum": 60,
      "description": "Days before renewal to send reminder. Required when half_yearly_renewal_reminders_enabled is yes",
      "example": 14
    }
  },
  "example": {
    "reminders_enabled": "yes",
    "invoice_reminders_enabled": "yes",
    "invoice_reminder_due_days": 3,
    "invoice_reminder_overdue_days": "1,3,7",
    "yearly_renewal_reminders_enabled": "yes",
    "yearly_renewal_reminder_days": 30,
    "trial_end_reminders_enabled": "yes",
    "trial_end_reminder_days": 3,
    "monthly_renewal_reminders_enabled": "no",
    "monthly_renewal_reminder_days": 7,
    "quarterly_renewal_reminders_enabled": "no",
    "quarterly_renewal_reminder_days": 14,
    "half_yearly_renewal_reminders_enabled": "no",
    "half_yearly_renewal_reminder_days": 14
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Scheduling settings saved successfully |
| `400` | Bad request or save failed |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `422` | Validation failed, or the referenced record does not exist. |
