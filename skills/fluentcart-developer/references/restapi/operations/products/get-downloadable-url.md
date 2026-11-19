# GET Get Downloadable URL

## `GET /products/getDownloadableUrl/{downloadableId}`

**GET Get Downloadable URL**

Generate a temporary download URL for a downloadable file (valid for 7 days).

**Required permission:** `products/view`

- **operationId:** `getDownloadableUrl`
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
| `403` | Authenticated, but the user lacks the required capability (`products/view`). |
| `422` | Validation failed, or the referenced record does not exist. |
