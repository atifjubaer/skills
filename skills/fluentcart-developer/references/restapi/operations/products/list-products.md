# GET List Products

## `GET /products`

**GET List Products**

Retrieve a paginated list of products with filtering, sorting, and search capabilities.

**Required permission:** `products/view`

- **operationId:** `listProducts`
- **tags:** Products

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `search` | query | no | string | Search by product title, ID, or variation title |
| `per_page` | query | no | integer | Number of results per page |
| `page` | query | no | integer | Page number for pagination |
| `sort_by` | query | no | string | Column to sort by |
| `sort_type` | query | no | string | Sort direction: asc or desc |
| `active_view` | query | no | string | Filter tab |
| `filter_type` | query | no | string | Filter type |
| `with[]` | query | no | array | Relations to eager load |
| `search_groups` | query | no | array | Advanced filter groups for complex queries |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns a paginated list of products. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`products/view`). |
