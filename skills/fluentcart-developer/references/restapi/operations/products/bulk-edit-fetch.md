# GET Bulk Edit Fetch

## `GET /products/bulk-edit-data`

**GET Bulk Edit Fetch**

Fetch products formatted for the bulk editing spreadsheet view.

**Required permission:** `products/edit`

- **operationId:** `bulkEditFetch`
- **tags:** Products

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `search` | query | no | string | Search by product title |
| `per_page` | query | no | integer | Number of results per page |
| `page` | query | no | integer | Page number |
| `sort_by` | query | no | string | Column to sort by |
| `sort_type` | query | no | string | Sort direction |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`products/edit`). |
