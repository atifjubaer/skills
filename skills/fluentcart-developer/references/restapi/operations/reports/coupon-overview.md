# GET Get Coupon Overview

## `GET /reports/coupon-overview`

**GET Get Coupon Overview**

Returns the discount given, how many orders and new customers used a coupon, a chart by period and the previous period's figures. Amounts are integers in cents.

`orders` counts paid orders plus orders a coupon made free. `discount_rate` is the discount as a percent of what the coupon orders would have cost at full price. `new_customers` uses the shared first-purchase rule. `comparison` (new customers won with a coupon vs at full price: average first order net, average lifetime value, repeat and refund rates) is a FluentCart Pro report: it appears only when the `fluent_cart/report/coupon_quality` filter returns true. `previous` is `null` without a comparison.

**Permission:** `reports/view` · **Policy:** `ReportPolicy`

- **operationId:** `getCouponOverview`
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
