# GET Get Filter Options

## `GET /advance_filter/get-filter-options`

**GET Get Filter Options**

Retrieve dynamic filter options for the advanced filter dropdowns. Supports loading product variations, labels, and extensible custom data keys via WordPress filters.

**Access policy:** `AdvanceFilterPolicy`

**Access policy:** `AdvanceFilterPolicy`

- **operationId:** `getFilterOptions`
- **tags:** Dashboard

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `remote_data_key` | query | yes | string | The type of filter options to retrieve. Built-in values: product_variations, labels. Custom values are resolved via WordPress filters. |
| `search` | query | no | string | Search query to filter options |
| `include_ids` | query | no | string | Specific IDs to include in results |
| `limit` | query | no | integer | Maximum number of options to return |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
