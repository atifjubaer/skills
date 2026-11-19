# GET List Coupons

## `GET /coupons`

**GET List Coupons**

Retrieve a paginated list of coupons with optional filtering, sorting, and search. Coupon statuses are automatically updated based on their start/end dates before the response is returned.

**Required permission:** `coupons/view`

- **operationId:** `listCoupons`
- **tags:** Coupons

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `page` | query | no | integer | Page number for pagination |
| `per_page` | query | no | integer | Number of records per page (1-199, default: 10) |
| `search` | query | no | string | Search by coupon title, code, or ID. If the search string contains %, it searches percentage-type coupons by amount. Numeric values also match the amount field. Supports operator syntax (e.g., status = active, id > 5). |
| `sort_by` | query | no | string | Column to sort by (default: id). Must be a fillable column on the Coupon model. |
| `sort_type` | query | no | string | Sort direction: asc or desc (default: desc) |
| `active_view` | query | no | string | Tab filter. active = status is active. expired = end_date has passed or status != active. |
| `filter_type` | query | no | string | Filter mode: simple (default) or advanced |
| `advanced_filters` | query | no | string | JSON-encoded array of advanced filter groups (requires Pro) |
| `with` | query | no | string | Eager-load relations (comma-separated or array) |
| `select` | query | no | string | Comma-separated list of columns to select |
| `include_ids` | query | no | string | Comma-separated IDs that must always be included in results |
| `user_tz` | query | no | string | User timezone for date filtering (e.g., America/New_York) |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns a paginated list of coupons. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`coupons/view`). |
