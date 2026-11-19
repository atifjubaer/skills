# DELETE Delete File

## `DELETE /files/delete`

**DELETE Delete File**

Delete a file from the specified storage driver. For the local driver, this requires the `manage_options` WordPress capability.

**Access policy:** `StoreSensitivePolicy`

**Access policy:** `StoreSensitivePolicy`

- **operationId:** `deleteFile`
- **tags:** Files

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `file_path` | query | yes | string | The path of the file to delete (relative to the storage directory). |
| `driver` | query | yes | string | Storage driver where the file is stored (e.g., `local`, `s3`). |
| `bucket` | query | no | string | The bucket name (required for cloud storage drivers). |

### Responses

| Status | Description |
| --- | --- |
| `200` | File deleted successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Permission denied. |
| `404` | File not found. |
