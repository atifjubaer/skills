# GET List Products

## `GET /public/products`

**GET List Products**

Retrieve a paginated list of published products with optional filtering by taxonomy terms, price range, product type, and more. Only products with publish status are returned.

**Access policy:** `PublicPolicy`

**Access policy:** `PublicPolicy`

- **operationId:** `listProducts`
- **tags:** Public Shop

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `per_page` | query | no | integer | Number of products per page |
| `current_page` | query | no | integer | Page number for offset-based pagination |
| `cursor` | query | no | string | Cursor token for cursor-based pagination |
| `paginate_using` | query | no | string | Pagination strategy: cursor for cursor-based, omit for offset-based |
| `order_type` | query | no | string | Sort direction |
| `with[]` | query | no | array | Relations to eager load (e.g., detail) |
| `allow_out_of_stock` | query | no | boolean | Include out-of-stock products |
| `include_ids[]` | query | no | array | Only return products with these IDs (max 100 IDs) |
| `exclude_ids[]` | query | no | array | Exclude products with these IDs (max 100 IDs) |
| `product_type` | query | no | string | Filter by product type |
| `on_sale` | query | no | boolean | Only return products currently on sale |
| `filters[wildcard]` | query | no | string | Search by product title |
| `filters[sort_by]` | query | no | string | Sort preset |
| `filters[price_range_from]` | query | no | number | Minimum price filter in decimal (e.g., 10.00) |
| `filters[price_range_to]` | query | no | number | Maximum price filter in decimal (e.g., 99.99) |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
