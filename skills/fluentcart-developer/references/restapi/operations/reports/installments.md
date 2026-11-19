# GET Get Installments

## `GET /reports/installments`

**GET Get Installments**

Returns installment-plan health over all time: plans started, money collected and still owed, plans by status bucket, payments due in the next 30 days and the product picker options. Amounts are in cents.

Installment plans are subscriptions with a fixed number of payments. The date range does not apply; `started_from` and `started_to` filter by the plan's first paid order. `schedule`, `starts` and `summary.collection_rate` come only when FluentCart Pro answers the `fluent_cart/report/installment_forecast` filter.

**Permission:** `reports/view` · **Policy:** `ReportPolicy`

- **operationId:** `getInstallments`
- **tags:** Reports

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `params[currency]` | query | no | string | 3-letter currency code. Defaults to the base currency. `__all__` converts every currency to the base currency. |
| `params[variation_ids][]` | query | no | array | Product variation IDs to filter by. |
| `params[started_from]` | query | no | string | Only plans whose first paid order is on or after this store day (Y-m-d). |
| `params[started_to]` | query | no | string | Only plans whose first paid order is on or before this store day (Y-m-d). |
| `params[as_of]` | query | no | string | Day to measure from (Y-m-d). Defaults to today. |
| `params[at_risk_limit]` | query | no | integer | Number of at-risk rows to include, 0 to 500. Default `0` (none). |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
