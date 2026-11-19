# GET Search Variants by Name

## `GET /products/searchVariantByName`

**GET Search Variants by Name**

Search for published product variants by name. Returns a hierarchical product > variants structure.

**Required permission:** `products/view`

- **operationId:** `searchVariantsByName`
- **tags:** Products

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `name` | query | no | string | Product/variant name to search |
| `search` | query | no | string | Alternative search parameter (used if name is empty) |
| `ids[]` | query | no | array | Array of product IDs to include |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`products/view`). |
