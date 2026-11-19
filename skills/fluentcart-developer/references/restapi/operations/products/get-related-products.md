# GET Get Related Products

## `GET /products/{productId}/related-products`

**GET Get Related Products**

Retrieve products related to a given product based on shared categories or brands.

**Required permission:** `products/view`

- **operationId:** `getRelatedProducts`
- **tags:** Products

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `productId` | path | yes | integer | The product ID |
| `related_by_categories` | query | no | boolean | Include products from same categories |
| `related_by_brands` | query | no | boolean | Include products from same brands |
| `order_by` | query | no | string | Sort order (default: title_asc) |
| `posts_per_page` | query | no | integer | Number of related products to return (default: 6) |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`products/view`). |
| `422` | Validation failed, or the referenced record does not exist. |
