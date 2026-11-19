# GET List Customers

## `GET /customers`

**GET List Customers**

Retrieve a paginated list of customers with support for searching, sorting, and advanced filtering.

**Required permission:** `customers/view`

- **operationId:** `listCustomers`
- **tags:** Customers

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `search` | query | no | string | Search by customer name, email, or ID. Supports operator syntax (e.g., `id=5`, `ltv>1000`). |
| `per_page` | query | no | integer | Number of items per page (1-199, default: 10) |
| `page` | query | no | integer | Page number for pagination |
| `sort_by` | query | no | string | Column to sort by. Must be a fillable field on the Customer model (default: `id`) |
| `sort_type` | query | no | string | Sort direction: `asc` or `desc` (default: `desc`) |
| `filter_type` | query | no | string | Filter mode: `simple` or `advanced` (default: `simple`) |
| `advanced_filters` | query | no | string | JSON-encoded array of advanced filter groups (Pro only). Supports filtering by order items, purchase count, purchase dates, customer name, email, LTV, and labels. |
| `with` | query | no | array | Relationships to eager-load (e.g., `orders`, `labels`, `billing_address`, `shipping_address`) |
| `select` | query | no | string | Comma-separated column names or array of columns to select |
| `include_ids` | query | no | string | Comma-separated IDs or array of IDs that must be included in results |
| `active_view` | query | no | string | Active tab/view filter |
| `user_tz` | query | no | string | User timezone for date filter conversion |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns a paginated list of customers. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`customers/view`). |
