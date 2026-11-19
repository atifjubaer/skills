# GET Get Subscription Retention

## `GET /reports/subscription-retention`

**GET Get Subscription Retention**

Returns one row per store month (or year) in the range: new, churned, retained and active subscriptions, MRR, churn reasons and the renewal rate. MRR and `period_gross` are decimals.

Open-ended plans only. Retained = the starting base still active at period end. `retained_mrr`, `mrr` and `start_mrr` are decimal strings. `intervals` lists the billing intervals that have subscriptions, most first. The range end is clamped to today.

**Permission:** `reports/view` · **Policy:** `ReportPolicy`

- **operationId:** `getSubscriptionRetention`
- **tags:** Reports

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `params[startDate]` | query | no | string | First store day of the range (Y-m-d). |
| `params[endDate]` | query | no | string | Last store day of the range (Y-m-d). |
| `params[rangeKey]` | query | no | string | Preset range relative to today. Overrides the dates. |
| `params[currency]` | query | no | string | 3-letter currency code. Defaults to the base currency. `__all__` converts every currency to the base currency. |
| `params[variation_ids][]` | query | no | array | Product variation IDs to filter by. |
| `params[period]` | query | no | string | Row size. `year` gives one row per year; any other value one row per month. |
| `params[billingInterval]` | query | no | string | Only subscriptions with this billing interval, e.g. `month` or `year`. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
