# GET Get Customer Overview

## `GET /reports/customer-overview`

**GET Get Customer Overview**

Returns the customers who paid in the period, split into new, returning and renewing, with their net sales, the repeat purchase rate, average lifetime value and a chart. Amounts are integers in cents; net figures are the Revenue report's net sales.

Only orders with a customer and a paid amount above 0 count. Each customer gets one kind: new (first purchase in the range) before returning (bought again, not a renewal) before renewing (renewals only). `repeat_rate` is the share with two or more purchases (renewals are not purchases) and `average_ltv` the average lifetime net, both over each customer's history up to the range end. `previous` (comparison period) has the same keys without `repeat_rate` and `average_ltv`; it is `null` without a comparison.

**Permission:** `reports/view` · **Policy:** `ReportPolicy`

- **operationId:** `getCustomerOverview`
- **tags:** Reports

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `params[startDate]` | query | no | string | First day of the range, store timezone (`YYYY-MM-DD`). |
| `params[endDate]` | query | no | string | Last day of the range, store timezone (`YYYY-MM-DD`). |
| `params[rangeKey]` | query | no | string | Preset range. Overrides the dates. |
| `params[groupKey]` | query | no | string | Chart bucket: `daily`, `monthly`, `yearly`, or `default` (picked from the range length). |
| `params[currency]` | query | no | string | 3-letter currency code. `__all__` converts every currency to the base currency. Default: base currency. |
| `params[filterMode]` | query | no | string | Only live or only test orders. Without it, both count. |
| `params[variation_ids][]` | query | no | array | Only orders that contain these variation IDs. |
| `params[compareType]` | query | no | string | Comparison period. |
| `params[compareDate]` | query | no | string | Start of the comparison range when `compareType` is `custom`. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
