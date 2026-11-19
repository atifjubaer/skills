# GET List Tax Records

## `GET /taxes`

**GET List Tax Records**

Retrieve a paginated list of order tax rate records with optional filtering, sorting, and search.

**Access policy:** `AdminPolicy` — requires the `is_super_admin` FluentCart capability.

- **operationId:** `listTaxRecords`
- **tags:** Tax

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `page` | query | no | integer | Page number for pagination |
| `per_page` | query | no | integer | Number of records per page (default: 10, max: 200) |
| `search` | query | no | string | Search term. If numeric, searches by id or order_id. Also searches related tax rate country, state, postcode, and name fields. Supports operator syntax (e.g., id = 5, order_id > 100). |
| `sort_by` | query | no | string | Column to sort by (default: id) |
| `sort_type` | query | no | string | Sort direction: asc or desc (default: desc) |
| `active_view` | query | no | string | Tab filter. One of: filed (records with filed_at set), not_filed (records without filed_at). |
| `filter_type` | query | no | string | Filter mode: simple (default) or advanced |
| `advanced_filters` | query | no | string | JSON-encoded array of advanced filter groups. Supports filtering by country, region, tax name, and filed status. |
| `with` | query | no | string | Eager-load relations (e.g., order, tax_rate) |
| `select` | query | no | string | Comma-separated list of columns to select |
| `include_ids` | query | no | string | Comma-separated IDs that must always be included in results |
| `user_tz` | query | no | string | User timezone for date filtering (e.g., America/New_York) |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns paginated tax records. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
