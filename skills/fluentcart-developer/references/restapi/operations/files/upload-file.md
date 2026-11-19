# POST Upload File

## `POST /files/upload`

**POST Upload File**

Upload a downloadable file to the specified storage driver. The file is stored with a unique name appended with a timestamp to prevent collisions.

**Access policy:** `StoreSensitivePolicy`

**Access policy:** `StoreSensitivePolicy`

- **operationId:** `uploadFile`
- **tags:** Files

### Request body

`multipart/form-data`

```json
{
  "$ref": "#/components/schemas/UploadFileRequest"
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | File uploaded successfully. |
| `400` | Bad request - validation error or file empty. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `422` | Validation failed, or the referenced record does not exist. |
