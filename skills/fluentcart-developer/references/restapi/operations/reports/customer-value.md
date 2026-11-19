# GET Get Customer Value

## `GET /reports/customer-value`

**GET Get Customer Value**

Returns customer lifetime value by first-purchase month, value by first product, and revenue concentration. Amounts are in cents and use the Revenue report's net sales. Only paid orders (`total_paid` > 0) with a customer count.

`cohorts` covers the 12 months ending with the range's last month; `values[n]` is the average cumulative net per customer after month n (at most 24 months). A customer is gained in a month when their first non-renewal paid order is there, with no earlier paid purchase in any currency. `first_products` covers customers gained in the range; `repeat_rate` is the percent who made another non-renewal purchase. `concentration.period` is the percent of net sales from the top 1, 5, 10, 20 and 50 percent of customers in the range; customers with net 0 or less are left out. `concentration.lifetime` is `null` unless `span=lifetime` is sent.

**Requires FluentCart Pro.** Without Pro this route is not registered and returns 404.

**Permission:** `reports/view` · **Policy:** `ReportPolicy`

- **operationId:** `getCustomerValue`
- **tags:** Reports

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `span` | query | no | string | Top-level. `lifetime` returns only `concentration.lifetime` (all-time concentration). |
| `params[startDate]` | query | no | string | First day of the range (Y-m-d), store timezone. |
| `params[endDate]` | query | no | string | Last day of the range (Y-m-d), store timezone. |
| `params[rangeKey]` | query | no | string | Preset range. Overrides the dates. |
| `params[currency]` | query | no | string | 3-letter currency code, or `__all__` for all currencies converted to the base currency. Default: the base currency. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
