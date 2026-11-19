# GET List Attribute Terms

## `GET /options/attr/group/{group_id}/terms`

**GET List Attribute Terms**

Retrieve a paginated list of terms for a specific attribute group. Attribute terms are the individual values within an attribute group (e.g., "Red", "Blue", "Green" within the "Color" group).

**Required permission:** `products/view`

- **operationId:** `listAttributeTerms`
- **tags:** Labels

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | The attribute group ID. |
| `search` | query | no | object | Search criteria. Each key is a column name with `column`, `operator`, and `value` fields. Searchable columns: `title`, `slug`. |
| `filters` | query | no | object | Filter criteria. Same format as `search`. Filterable columns: `group_id`, `serial`, `title`, `slug`, `description`, `settings`. |
| `order_by` | query | no | string | Column to sort by: `id`, `title`, `slug`, `serial`, `created_at` (default: `serial`). |
| `order_type` | query | no | string | Sort direction: `ASC` or `DESC` (default: `ASC`). |
| `per_page` | query | no | integer | Number of results per page (default: `15`). |
| `page` | query | no | integer | Page number for pagination. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns paginated attribute terms. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`products/view`). |
| `422` | Validation failed, or the referenced record does not exist. |
