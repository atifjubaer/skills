# GET Search Product Variant Options

## `GET /products/search-product-variant-options`

**GET Search Product Variant Options**

Search for product variants suitable for selection (e.g., in order creation). Filters out out-of-stock items.

**Required permission:** `products/view`

- **operationId:** `searchProductVariantOptions`
- **tags:** Products

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `search` | query | no | string | Search term for product/variant title |
| `include_ids[]` | query | no | array | Variation IDs to always include in results |
| `scopes[]` | query | no | array | Model scopes to apply |
| `subscription_status` | query | no | string | Use not_subscribable to exclude subscription variants |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`products/view`). |
