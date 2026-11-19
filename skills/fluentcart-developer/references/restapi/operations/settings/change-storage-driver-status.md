# POST Change Storage Driver Status

## `POST /settings/storage-drivers/change-status`

**POST Change Storage Driver Status**

Enable or disable a storage driver that does not manage its own bucket (bucket-backed drivers such as S3 must instead be configured from their own settings page). Only flips the driver's `is_active` flag.

**Required permission:** `is_super_admin`

- **operationId:** `changeStatus`
- **tags:** Settings

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "driver",
    "status"
  ],
  "properties": {
    "driver": {
      "type": "string",
      "description": "The storage driver key (e.g., `local`).",
      "example": "local"
    },
    "status": {
      "type": "string",
      "enum": [
        "yes",
        "no"
      ],
      "description": "New active status for the driver."
    }
  },
  "example": {
    "driver": "local",
    "status": "yes"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns the updated driver settings. |
| `400` | The driver manages its own bucket and must be configured from its settings page, or saving the new status failed. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`is_super_admin`). |
| `404` | The named driver does not exist. |
| `422` | `status` was not `yes` or `no`. |
