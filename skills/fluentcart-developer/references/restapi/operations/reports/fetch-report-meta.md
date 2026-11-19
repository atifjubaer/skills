# GET Get Report Meta

## `GET /reports/fetch-report-meta`

**GET Get Report Meta**

Returns the data the report filters need: currencies with orders in the range, order counts per currency, the base currency, the earliest order date and the store mode.

With more than one currency, `currencies` also holds `__all__` (all currencies converted to the base currency), and `converted_excluded_orders` counts orders that cannot convert. Dates are store-timezone strings.

**Permission:** `reports/view` · **Policy:** `ReportPolicy`

- **operationId:** `getReportMeta`
- **tags:** Reports

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `params[startDate]` | query | no | string | First store day for the currency lookup (Y-m-d). |
| `params[endDate]` | query | no | string | Last store day for the currency lookup (Y-m-d). |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
