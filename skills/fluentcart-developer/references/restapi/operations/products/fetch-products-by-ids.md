# GET Fetch Products by IDs

## `GET /products/fetchProductsByIds`

**GET Fetch Products by IDs**

Retrieve products by an array of IDs. Returns products with their detail relation.

**Required permission:** `products/view`

- **operationId:** `fetchProductsByIds`
- **tags:** Products

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `productIds[]` | query | yes | array | Array of product IDs to fetch |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`products/view`). |
