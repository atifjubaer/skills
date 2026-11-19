# POST Save Storage Driver Settings

## `POST /settings/storage-drivers`

**POST Save Storage Driver Settings**

Create or update settings for a specific file storage driver.

**Required permission:** `is_super_admin`

- **operationId:** `saveStorageDriverSettings`
- **tags:** Settings

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "driver",
    "settings"
  ],
  "properties": {
    "driver": {
      "type": "string",
      "description": "The storage driver key (e.g., `local`, `s3`, `bunny`).",
      "example": "s3"
    },
    "settings": {
      "type": "object",
      "description": "Driver-specific configuration settings. Fields vary by driver.",
      "additionalProperties": true,
      "example": {
        "access_key": "AKIA...",
        "secret_key": "wJalr...",
        "bucket": "my-store-files",
        "region": "us-east-1"
      }
    }
  },
  "example": {
    "driver": "s3",
    "settings": {
      "access_key": "AKIA...",
      "secret_key": "wJalr...",
      "bucket": "my-store-files",
      "region": "us-east-1"
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
