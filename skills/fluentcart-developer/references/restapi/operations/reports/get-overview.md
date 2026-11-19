# GET Get Reports Overview

## `GET /reports/overview`

**GET Get Reports Overview**

Returns year-over-year gross and net revenue for the last 12 store months, the last 4 quarters and the top 5 billing countries, plus 24 months of net sales. The revenue series are in cents; `net_sales_months` is a decimal.

This endpoint does not use the date range. `net_revenue` is paid − refunds − unrefunded tax (shipping and fees stay in). `net_sales_months` is the Revenue report's net sales. Only `net_sales_months` accepts `__all__`; the other series use one currency. With `params[net_sales_only]=1` only `net_sales_months` is returned.

**Permission:** `reports/view` · **Policy:** `ReportPolicy`

- **operationId:** `getReportsOverview`
- **tags:** Reports

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `params[currency]` | query | no | string | 3-letter currency code. Defaults to the base currency. `__all__` converts every currency to the base currency. |
| `params[net_sales_only]` | query | no | integer | When `1`, return only `net_sales_months`. |
| `params[cached]` | query | no | integer | With `net_sales_only`, when `1` the result may come from a 10-minute cache. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
