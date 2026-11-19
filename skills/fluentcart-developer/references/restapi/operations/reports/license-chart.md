# GET Get License Chart

## `GET /reports/license-chart`

**GET Get License Chart**

Returns the number of licenses created per day, month or year in the range.

This is a core route, but it reads the `fct_licenses` table that the FluentCart Pro licensing module creates. Without that table the query fails silently and every bucket is 0. Daily rows have `date`; monthly rows have `year` and `month`; yearly rows have `year`.

**Permission:** `reports/view` · **Policy:** `ReportPolicy`

- **operationId:** `getLicenseChart`
- **tags:** Reports

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `params[startDate]` | query | no | string | First store day of the range (Y-m-d). |
| `params[endDate]` | query | no | string | Last store day of the range (Y-m-d). |
| `params[groupKey]` | query | no | string | Bucket size. Default `daily`; `default` picks by range length. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
