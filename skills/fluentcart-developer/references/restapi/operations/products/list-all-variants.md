# GET List All Variants

## `GET /variants`

**GET List All Variants**

Retrieve all product variations across all products (separate route group using VariantController).

**Required permission:** `products/view`

- **operationId:** `listAllVariants`
- **tags:** Products

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `params` | query | no | object | Query parameters for filtering |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`products/view`). |
