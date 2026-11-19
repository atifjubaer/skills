# GET Get Order Chart

## `GET /reports/order-chart`

**GET Get Order Chart**

Returns order counts, items and money per day, month or year, with totals and rates. Amounts are decimal currency units.

`average_net` uses the Revenue report's net sales; `net_revenue` is paid minus refunds minus unrefunded tax. `monthly_net`, `monthly_gross`, `monthly_orders` and `monthly_items` appear in `summary` only when the range has orders. `refund_rate` is refunded orders as a percent of orders. With a comparison, `fluctuations` holds the percent change per summary key (`null` when the previous value is 0) and `previousChartData` holds the comparison buckets.

**Permission:** `reports/view` · **Policy:** `ReportPolicy`

- **operationId:** `getOrderChart`
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
