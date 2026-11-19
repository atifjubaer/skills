# GET List Subscriptions

## `GET /subscriptions`

**GET List Subscriptions**

Retrieve a paginated list of subscriptions with optional filtering, sorting, and search.

**Required permission:** `subscriptions/view`

- **operationId:** `listSubscriptions`
- **tags:** Subscriptions

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `page` | query | no | integer | Page number for pagination |
| `per_page` | query | no | integer | Number of records per page (default: 10, max: 200) |
| `search` | query | no | string | Search term. Searches status, subscription ID (#123), customer email (user@example.com), parent order ID, item name, vendor subscription/customer/plan IDs, payment method, billing interval, and bill count. Also supports operator syntax (e.g., ID = 5). |
| `sort_by` | query | no | string | Column to sort by (default: id). Must be a fillable column on the Subscription model. |
| `sort_type` | query | no | string | Sort direction: asc or desc (default: desc) |
| `active_view` | query | no | string | Tab filter for subscription status. |
| `filter_type` | query | no | string | Filter mode: simple (default) or advanced. |
| `advanced_filters` | query | no | string | JSON-encoded array of advanced filter groups (requires Pro). Supports filtering by subscription, transaction, product, and license properties. |
| `with` | query | no | string | Eager-load relations. Supports relation names and {relation}Count for counts. |
| `select` | query | no | string | Comma-separated list of columns to select. |
| `include_ids` | query | no | string | Comma-separated IDs that must always be included in results. |
| `limit` | query | no | integer | Limit number of records (used with non-paginated queries). |
| `offset` | query | no | integer | Offset for records. |
| `user_tz` | query | no | string | User timezone for date filtering (e.g., America/New_York). |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns a paginated list of subscriptions. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`subscriptions/view`). |
