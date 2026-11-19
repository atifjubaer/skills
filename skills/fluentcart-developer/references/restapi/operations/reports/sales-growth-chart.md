# GET Get Sales Growth Chart

## `GET /reports/sales-growth-chart`

**GET Get Sales Growth Chart**

Returns orders and net sales per day, month or year in the range. `net_revenue` is the Revenue report's net sales, as a decimal.

Counts orders in the report payment statuses. On-hold and failed orders are left out by default. The range end is clamped to today.

**Permission:** `reports/view` · **Policy:** `ReportPolicy`

- **operationId:** `getSalesGrowthChart`
- **tags:** Reports

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `params[startDate]` | query | no | string | First store day of the range (Y-m-d). |
| `params[endDate]` | query | no | string | Last store day of the range (Y-m-d). |
| `params[rangeKey]` | query | no | string | Preset range relative to today. Overrides the dates. |
| `params[groupKey]` | query | no | string | Chart bucket. `default` picks daily (up to 91 days), monthly (up to 365 days) or yearly. |
| `params[currency]` | query | no | string | 3-letter currency code. Defaults to the base currency. `__all__` converts every currency to the base currency. |
| `params[filterMode]` | query | no | string | Count only live or only test orders. Both when omitted. |
| `params[variation_ids][]` | query | no | array | Product variation IDs to filter by. |
| `params[orderStatus][]` | query | no | array | Order statuses to leave out. Defaults to `on-hold` and `failed`; `all` also gives that default. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
