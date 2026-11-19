# POST Create Storage Bucket

## `POST /settings/storage-drivers/create-bucket`

**POST Create Storage Bucket**

Create a new bucket on a storage driver using the supplied credentials. Used by the settings UI when a store wants to provision a bucket instead of using an existing one.

**Required permission:** `is_super_admin`

- **operationId:** `createBucket`
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
      "description": "Driver-specific credentials and the new bucket name/configuration. Fields vary by driver.",
      "additionalProperties": true,
      "example": {
        "access_key": "AKIAEXAMPLE1234",
        "secret_key": "your-secret-key-here",
        "region": "us-east-1",
        "bucket": "my-store-files"
      }
    }
  },
  "example": {
    "driver": "s3",
    "settings": {
      "access_key": "AKIAEXAMPLE1234",
      "secret_key": "your-secret-key-here",
      "region": "us-east-1",
      "bucket": "my-store-files"
    }
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. The bucket was created. |
| `400` | The driver could not be resolved, or bucket creation was rejected by the storage provider. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`is_super_admin`). |
| `422` | Validation failed, or the referenced record does not exist. |
