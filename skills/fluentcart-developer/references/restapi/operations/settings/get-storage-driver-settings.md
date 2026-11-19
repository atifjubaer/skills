# GET Get Storage Driver Settings

## `GET /settings/storage-drivers/{driver}`

**GET Get Storage Driver Settings**

Retrieve the configuration settings and field schema for a specific storage driver.

**Required permission:** `is_super_admin`

- **operationId:** `getStorageDriverSettings`
- **tags:** Settings

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `driver` | path | yes | string | The storage driver key (e.g., `local`, `s3`, `bunny`). |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`is_super_admin`). |
| `422` | Validation failed, or the referenced record does not exist. |
