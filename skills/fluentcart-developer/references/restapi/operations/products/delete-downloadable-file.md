# DELETE Delete Downloadable File

## `DELETE /products/{downloadableId}/delete`

**DELETE Delete Downloadable File**

Delete a downloadable file record.

**Required permission:** `products/delete`

- **operationId:** `deleteDownloadableFile`
- **tags:** Products

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `downloadableId` | path | yes | integer | The downloadable file ID |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`products/delete`). |
| `422` | Validation failed, or the referenced record does not exist. |
