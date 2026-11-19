# GET Get Subscription Cohorts

## `GET /reports/subscription-cohorts`

**GET Get Subscription Cohorts**

Returns subscription cohort retention from the retention snapshots table, by start month or start year. MRR values are decimals.

The date range does not apply: month view shows the last 24 months of cohorts, year view every year. One currency only (`__all__` is read as the base currency). `metric=mrr`, `billingInterval` and `rebuyAdjusted` need FluentCart Pro (`fluent_cart/report/cohort_options`); without it the metric is `subscribers` and `full` is false. Build the snapshots with `POST /reports/retention-snapshots/generate`.

**Permission:** `reports/view` · **Policy:** `ReportPolicy`

- **operationId:** `getSubscriptionCohorts`
- **tags:** Reports

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `params[currency]` | query | no | string | 3-letter currency code. Defaults to the base currency. `__all__` is read as the base currency. |
| `params[variation_ids][]` | query | no | array | Product variation IDs to filter by. |
| `params[groupBy]` | query | no | string | Cohort size. Default `year`. |
| `params[metric]` | query | no | string | Metric to show (Pro). Default `subscribers`. |
| `params[billingInterval]` | query | no | string | Only cohorts of this billing interval (Pro). |
| `params[rebuyAdjusted]` | query | no | boolean | Count a cancel-and-rebuy as retained (Pro). |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
