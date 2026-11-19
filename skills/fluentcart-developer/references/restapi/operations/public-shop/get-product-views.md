# GET Get Product Views

## `GET /public/product-views`

**GET Get Product Views**

Retrieve server-rendered HTML views of product listings. Used by Gutenberg blocks and shortcodes for AJAX-powered product grids.

**Access policy:** `PublicPolicy`

- **operationId:** `getProductViews`
- **tags:** Public Shop

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `per_page` | query | no | integer | Number of products per page |
| `current_page` | query | no | integer | Current page number |
| `template_provider` | query | no | string | Template provider identifier for custom rendering |
| `client_id` | query | no | string | Client identifier used to retrieve cached block markup from transients |
| `order_type` | query | no | string | Sort direction |
| `filters[sort_by]` | query | no | string | Sort preset |
| `filters[wildcard]` | query | no | string | Search by product title |
| `filters[price_range_from]` | query | no | number | Minimum price filter in decimal |
| `filters[price_range_to]` | query | no | number | Maximum price filter in decimal |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
