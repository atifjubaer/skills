# PUT Mark Activity Read/Unread

## `PUT /activity/{id}/mark-read`

**PUT Mark Activity Read/Unread**

Toggle the read status of an activity log entry.

**Access policy:** `AdminPolicy` — requires the `is_super_admin` FluentCart capability.

- **operationId:** `markActivityRead`
- **tags:** Dashboard

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `id` | path | yes | integer | The activity log entry ID |

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "status"
  ],
  "properties": {
    "status": {
      "type": "string",
      "enum": [
        "read",
        "unread"
      ],
      "description": "New read status"
    }
  },
  "example": {
    "status": "read"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `422` | Validation failed, or the referenced record does not exist. |
