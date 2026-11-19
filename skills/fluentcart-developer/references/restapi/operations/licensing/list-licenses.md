# GET List Licenses

## `GET /licensing/licenses`

**GET List Licenses**

Retrieve a paginated list of all licenses with optional filtering, sorting, and search.

**Permission:** `licenses/view` · **Policy:** `LicensePolicy`

- **operationId:** `listLicenses`
- **tags:** Licensing

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `page` | query | no | integer | Page number for pagination |
| `per_page` | query | no | integer | Number of records per page (default: 10, max: 200) |
| `search` | query | no | string | Search term. Searches across license key, order ID, customer name, customer email, and activated site URLs. Also supports operator syntax (e.g., `license_key = abc123`) |
| `sort_by` | query | no | string | Column to sort by (default: `id`). Must be a fillable column on the License model |
| `sort_type` | query | no | string | Sort direction: `asc` or `desc` (default: `desc`) |
| `active_view` | query | no | string | Tab filter. One of: `active`, `expired`, `disabled`, `inactive` |
| `filter_type` | query | no | string | Filter mode: `simple` (default) or `advanced` |
| `advanced_filters` | query | no | string | JSON-encoded array of advanced filter groups (requires Pro). Supports filtering by product, customer, and license properties |
| `with` | query | no | string | Eager-load relations. Supports relation names and `{relation}Count` for counts |
| `select` | query | no | string | Comma-separated list of columns to select |
| `scopes` | query | no | array | Model scopes to apply |
| `include_ids` | query | no | string | Comma-separated IDs that must always be included in results |
| `limit` | query | no | integer | Limit number of records (used with non-paginated queries) |
| `offset` | query | no | integer | Offset for records |
| `user_tz` | query | no | string | User timezone for date filtering (e.g., `America/New_York`) |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
