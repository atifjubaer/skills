# GET List Files

## `GET /files`

**GET List Files**

Retrieve a list of files from the specified storage driver. Returns file metadata including name, size, driver, and bucket information.

**Access policy:** `StoreSensitivePolicy`

**Access policy:** `StoreSensitivePolicy`

- **operationId:** `listFiles`
- **tags:** Files

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `driver` | query | no | string | Storage driver to use (default: `local`). Supported values depend on configured storage drivers (e.g., `local`, `s3`). |
| `search` | query | no | string | Filter files by name (case-insensitive substring match). |
| `per_page` | query | no | integer | Maximum number of files to return (default: `10`). |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns a list of files. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
