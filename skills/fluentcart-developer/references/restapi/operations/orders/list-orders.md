# GET List Orders

## `GET /orders`

**GET List Orders**

Retrieve a paginated list of orders with optional filtering, sorting, and search.

**Required permission:** `orders/view`

- **operationId:** `listOrders`
- **tags:** Orders

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `page` | query | no | integer | Page number for pagination |
| `per_page` | query | no | integer | Number of records per page (default: 10, max: 200) |
| `search` | query | no | string | Search term. Searches invoice number, customer name/email, and order item titles. Also supports operator syntax (e.g., `status = completed`, `id > 5`, `id :: 1-10`) |
| `sort_by` | query | no | string | Column to sort by (default: `id`). Must be a fillable column on the Order model |
| `sort_type` | query | no | string | Sort direction: `asc` or `desc` (default: `desc`) |
| `active_view` | query | no | string | Tab filter for quick views |
| `filter_type` | query | no | string | Filter mode: `simple` (default) or `advanced` |
| `advanced_filters` | query | no | string | JSON-encoded array of advanced filter groups (requires Pro). Supports filtering by order properties, customer properties, transaction properties, license properties, and UTM properties |
| `with` | query | no | string | Eager-load relations. Supports relation names and `{relation}Count` for counts |
| `select` | query | no | string | Comma-separated list of columns to select |
| `include_ids` | query | no | string | Comma-separated IDs that must always be included in results |
| `limit` | query | no | integer | Limit number of records (used with non-paginated queries) |
| `offset` | query | no | integer | Offset for records |
| `user_tz` | query | no | string | User timezone for date filtering (e.g., `America/New_York`) |
| `payment_statuses` | query | no | array | Filter by payment statuses |
| `order_statuses` | query | no | array | Filter by order statuses |
| `shipping_statuses` | query | no | array | Filter by shipping statuses |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns a paginated list of orders. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`orders/view`). |
