# GET Get Product Sales

## `GET /reports/product-sales`

**GET Get Product Sales**

Returns one row per product with its variations, the totals and a chart. Each order's payment, refunds and net sales are shared across its lines by line amount. Amounts are integers in cents; `net` is the Revenue report's net sales.

`net` splits into `new_net` (non-renewal orders), `renewal_net` and `installment_net`. `units` leaves out signup-fee and fee lines. A $0 order counts as an order; `customers` and `new_customers` count paid orders only. `refund_rate` is `refunds` / `gross` as a percent. With a comparison, `previous` holds the comparison totals and each product gets `previous_net`; else `previous` and `previous_net` are `null`. Lines with no variation (fees, custom items) count in `summary` only.

**Permission:** `reports/view` · **Policy:** `ReportPolicy`

- **operationId:** `getProductSales`
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
