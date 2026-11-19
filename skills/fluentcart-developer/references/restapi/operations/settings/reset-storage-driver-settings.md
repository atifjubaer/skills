# POST Reset Storage Driver Settings

## `POST /settings/storage-drivers/reset`

**POST Reset Storage Driver Settings**

Reset a storage driver's saved settings (including any stored credentials) back to its defaults. The returned settings omit the driver's hidden/secret keys.

**Required permission:** `is_super_admin`

- **operationId:** `resetSettings`
- **tags:** Settings

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "driver"
  ],
  "properties": {
    "driver": {
      "type": "string",
      "description": "The storage driver key to reset (e.g., `s3`, `local`).",
      "example": "s3"
    }
  },
  "example": {
    "driver": "s3"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns the driver's reset settings, with secret keys omitted. |
| `400` | The driver could not be resolved, or resetting its settings failed. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`is_super_admin`). |
| `422` | Validation failed, or the referenced record does not exist. |
