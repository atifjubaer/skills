# GET Get Recent Activities

## `GET /reports/get-recent-activities`

**GET Get Recent Activities**

Returns the 10 newest activity log entries, optionally limited to today, yesterday or this week in the store timezone.

**Permission:** `reports/view` · **Policy:** `ReportPolicy`

- **operationId:** `getRecentActivities`
- **tags:** Reports

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `groupKey` | query | no | string | Time filter. Default `all`. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
