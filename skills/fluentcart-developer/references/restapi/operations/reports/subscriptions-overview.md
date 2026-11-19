# GET Get Subscriptions Overview

## `GET /reports/subscriptions-overview`

**GET Get Subscriptions Overview**

Returns subscription movement in the range: new, churned, churn rate, MRR movement, renewals paid and failed, and a movement chart. MRR and amounts are decimals; `renewal_amount` is the net sales of paid renewal orders.

Open-ended plans only; installment plans are left out. `mrr_by_plan`, `mrr_by_interval` and `trials` come only when FluentCart Pro answers the `fluent_cart/report/mrr_breakdown` filter and `params[summary_only]` is not set. `compare_range` and `compare_ranges` are always present; `compare_range` is null without a comparison.

**Permission:** `reports/view` · **Policy:** `ReportPolicy`

- **operationId:** `getSubscriptionsOverview`
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
| `params[compareType]` | query | no | string | Comparison period. |
| `params[compareDate]` | query | no | string | First day of the custom comparison period (Y-m-d). Used with `compareType=custom`. |
| `params[summary_only]` | query | no | integer | When `1`, leave out the Pro MRR breakdown and trial conversion. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
