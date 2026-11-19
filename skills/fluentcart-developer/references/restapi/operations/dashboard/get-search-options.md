# GET Get Search Options

## `GET /forms/search_options`

**GET Get Search Options**

Retrieve dynamic search/autocomplete options for form fields. Options are resolved via the fluent_cart/get_dynamic_search_{search_for} WordPress filter, allowing modules to provide context-specific search data.

**Required permission:** `super_admin`

- **operationId:** `getSearchOptions`
- **tags:** Dashboard

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `search_for` | query | yes | string | The type of search options to retrieve (used as the filter key suffix) |
| `search_by` | query | no | string | Additional search context or query string passed to the filter |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`super_admin`). |
