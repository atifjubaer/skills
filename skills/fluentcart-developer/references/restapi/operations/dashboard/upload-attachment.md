# POST Upload Attachment

## `POST /app/upload-attachments`

**POST Upload Attachment**

Upload an image file to the WordPress media library.

**Access policy:** `AdminPolicy` — requires the `is_super_admin` FluentCart capability.

- **operationId:** `uploadAttachment`
- **tags:** Dashboard

### Request body

`multipart/form-data`

```json
{
  "type": "object",
  "required": [
    "file"
  ],
  "properties": {
    "file": {
      "type": "string",
      "format": "binary",
      "description": "Image file to upload. Only image MIME types are accepted."
    }
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `400` | Invalid file type or no file attached |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `422` | Validation failed, or the referenced record does not exist. |
