# GET Get Coupons

## `GET /reports/coupons`

**GET Get Coupons**

Returns one row per coupon used in the range with orders, customers, sales, discount and refunds, plus totals and the discount given without a coupon row. Amounts are decimal currency units; `net_sales` is the Revenue report's net sales.

An order with several coupons shares its money by each coupon's discount. A renamed coupon stays one row under its current code; `used_as` lists the other codes it was used under. A deleted coupon keeps its rows under its code (`coupon_id` `null`). Rows sort by orders. `no_code` covers orders with a coupon discount in the header but no coupon row (for example imported renewals).

Without FluentCart Pro the rows and totals leave out `won_ltv`, `first_order_net`, `later_net`, `lifetime_net` and `refund_rate`. Pro adds them through the `fluent_cart/report/coupon_quality` filter.

**Permission:** `reports/view` · **Policy:** `ReportPolicy`

- **operationId:** `getCoupons`
- **tags:** Reports

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `params[startDate]` | query | no | string | First day of the range, store timezone (`YYYY-MM-DD`). |
| `params[endDate]` | query | no | string | Last day of the range, store timezone (`YYYY-MM-DD`). |
| `params[rangeKey]` | query | no | string | Preset range. Overrides the dates. |
| `params[currency]` | query | no | string | 3-letter currency code. `__all__` converts every currency to the base currency. Default: base currency. |
| `params[filterMode]` | query | no | string | Only live or only test orders. Without it, both count. |
| `params[variation_ids][]` | query | no | array | Only orders that contain these variation IDs. |
| `params[orderTypes][]` | query | no | array | Only these sale types. `renewal` leaves out installment payments. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
