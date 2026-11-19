# GET List Attribute Groups

## `GET /options/attr/groups`

**GET List Attribute Groups**

Retrieve a paginated list of attribute groups with optional search, filtering, and sorting. Attribute groups represent product attribute categories (e.g., Color, Size, Material) used to create product variations.

**Required permission:** `products/view`

- **operationId:** `listAttributeGroups`
- **tags:** Labels

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `search` | query | no | object | Search criteria. Each key is a column name with `column`, `operator`, and `value` fields. Searchable columns: `title`, `slug`. |
| `filters` | query | no | object | Filter criteria. Same format as `search`. Supports `terms_count` with comparison operators. |
| `with[]` | query | no | array | Relations to eager load (e.g., `terms`). |
| `order_by` | query | no | string | Column to sort by: `title`, `id`, `slug`, `created_at` (default: `title`). |
| `order_type` | query | no | string | Sort direction: `ASC` or `DESC` (default: `ASC`). |
| `per_page` | query | no | integer | Number of results per page (default: `10`). |
| `page` | query | no | integer | Page number for pagination. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns paginated attribute groups. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`products/view`). |
