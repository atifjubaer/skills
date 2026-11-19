# GET List Activities

## `GET /activity`

**GET List Activities**

Retrieve a paginated list of activity log entries with filtering and sorting support.

**Access policy:** `AdminPolicy` — requires the `is_super_admin` FluentCart capability.

- **operationId:** `listActivities`
- **tags:** Dashboard

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `search` | query | no | string | Search by ID (prefix with #), title, content, or module name |
| `active_view` | query | no | string | Filter by tab |
| `sort_by` | query | no | string | Column to sort by |
| `sort_type` | query | no | string | Sort direction |
| `per_page` | query | no | integer | Results per page (max 200) |
| `page` | query | no | integer | Page number for pagination |
| `filter_type` | query | no | string | Filter mode |
| `advanced_filters` | query | no | string | JSON-encoded advanced filter groups (requires filter_type=advanced and Pro) |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
