# GET Get Customer Insights

## `GET /reports/customer-insights`

**GET Get Customer Insights**

Returns repeat rates, lifetime value and the top 100 customers by lifetime net, for customers with an order in the range. Amounts are decimal currency units; net figures are the Revenue report's net sales.

A customer's history is every order with a report payment status (paid, partially paid, refunded, partially refunded) up to the range end, in the report currency. `repeat_any` counts customers with two or more orders of any type; `repeat_new` counts two or more purchases (one-time or new subscription). `range_net` is the net of orders from the range start. This endpoint reads only the date range and currency: `filterMode`, `variation_ids` and comparison params have no effect.

**Permission:** `reports/view` · **Policy:** `ReportPolicy`

- **operationId:** `getCustomerInsights`
- **tags:** Reports

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `params[startDate]` | query | no | string | First day of the range, store timezone (`YYYY-MM-DD`). |
| `params[endDate]` | query | no | string | Last day of the range, store timezone (`YYYY-MM-DD`). |
| `params[rangeKey]` | query | no | string | Preset range. Overrides the dates. |
| `params[currency]` | query | no | string | 3-letter currency code. `__all__` converts every currency to the base currency. Default: base currency. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
