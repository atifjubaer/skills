# GET Get Refunds Overview

## `GET /reports/refunds-overview`

**GET Get Refunds Overview**

Returns the refunds made in the period: totals, full vs partial, a chart, splits by sale type and payment method, reasons and refund rates. Amounts are decimal currency units.

Money out counts on the refund date, on orders of any date. Refund rates divide by the orders placed in the period: `refund_rate_cohort` (period orders refunded at all), `refund_rate_orders` (orders refunded in the period / orders placed), `refund_rate_amount` (refunded amount / paid amount). A rate is `null` when no orders were placed. `median_days` counts store calendar days from order to its first refund. `by_product` (the 10 most refunded products, by order date) is a FluentCart Pro report: it appears only when the `fluent_cart/report/refund_products` filter returns true. With a comparison, `fluctuations` gives rates as a point difference and other keys as a percent change (`null` when the previous value is 0).

**Permission:** `reports/view` · **Policy:** `ReportPolicy`

- **operationId:** `getRefundsOverview`
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
| `params[orderTypes][]` | query | no | array | Only these sale types. `renewal` leaves out installment payments. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
