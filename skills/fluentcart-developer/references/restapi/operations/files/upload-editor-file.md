# POST Upload Editor File

## `POST /upload-editor-file`

**POST Upload Editor File**

Upload an image file for use in the content editor (e.g., product descriptions). The image is uploaded to the WordPress Media Library via `media_handle_upload`. Only image files are accepted.

**Access policy:** `AdminPolicy` — requires the `is_super_admin` FluentCart capability.

- **operationId:** `uploadEditorFile`
- **tags:** Files

### Request body

`multipart/form-data`

```json
{
  "$ref": "#/components/schemas/UploadEditorFileRequest"
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Image uploaded successfully. Returns WordPress attachment data. |
| `400` | Bad request - non-image file or no file attached. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `422` | Validation failed, or the referenced record does not exist. |
