# GET List Product Variations

## `GET /products/variants`

**GET List Product Variations**

Retrieve a list of product variations.

**Required permissions:** all of `products/view`, `products/view`

- **operationId:** `listProductVariations`
- **tags:** Products

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `params` | query | no | object | Query parameters for filtering variations |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`products/view, products/view`). |
