# GET Search Products by Name

## `GET /products/searchProductByName`

**GET Search Products by Name**

Search for published products by name. Returns products formatted for select dropdowns.

**Required permission:** `products/view`

- **operationId:** `searchProductsByName`
- **tags:** Products

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `name` | query | no | string | Product name to search for |
| `url_mode` | query | no | string | URL mode flag |
| `termId` | query | no | integer | Filter by taxonomy term ID (product-categories) |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`products/view`). |
