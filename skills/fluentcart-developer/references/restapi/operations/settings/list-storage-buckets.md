# POST List Storage Buckets

## `POST /settings/storage-drivers/bucket-list`

**POST List Storage Buckets**

List the buckets available to a storage driver's credentials, without saving them. Used by the settings UI to populate a bucket picker while a driver is being configured.

**Required permission:** `is_super_admin`

- **operationId:** `listBuckets`
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
      "description": "The storage driver key (e.g., `s3`, `bunny`).",
      "example": "s3"
    },
    "settings": {
      "type": "object",
      "description": "Driver-specific credentials used to authenticate and list buckets. Fields vary by driver.",
      "additionalProperties": true,
      "example": {
        "access_key": "AKIAEXAMPLE1234",
        "secret_key": "your-secret-key-here",
        "region": "us-east-1"
      }
    },
    "query": {
      "type": "string",
      "description": "Optional search string to filter the bucket list by name.",
      "example": "store"
    }
  },
  "example": {
    "driver": "s3",
    "settings": {
      "access_key": "AKIAEXAMPLE1234",
      "secret_key": "your-secret-key-here",
      "region": "us-east-1"
    },
    "query": "store"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns the matching buckets as select-style options. |
| `400` | The driver could not be resolved, or the driver's credentials were rejected while listing buckets. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`is_super_admin`). |
| `422` | Validation failed, or the referenced record does not exist. |
