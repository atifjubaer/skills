# GET Get Locations

## `GET /reports/locations`

**GET Get Locations**

Returns orders, customers and money by country. With FluentCart Pro it also drills down to states and cities and adds lifetime value, repeat rate and the biggest movers. Amounts are decimal currency units; `net_sales` is the Revenue report's net sales.

Without Pro, the report is always at country level (`level` is ignored) and `full` is `false`. Pro answers the `fluent_cart/report/locations` filter with the full report (`full: true`): `level`, `country` and `state` work, each row gets `average_ltv` and `repeat_rate` of the new customers it won, and `movers` lists the three biggest gains and drops in net sales against the comparison period.

An order's location is its latest address of the chosen type (shipping falls back to billing), else a renewal's parent order billing address, else the customer record's country, else `__unknown__`. In a row, a customer counts once: new wins over returning (`returning_customers` leaves out customers who are new there). Renewal orders count in `renewal_orders`, not as new or returning. With `variation_ids`, the money fields are the picked variations' share of each order.

**Permission:** `reports/view` · **Policy:** `ReportPolicy`

- **operationId:** `getLocations`
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
| `params[compareType]` | query | no | string | Comparison period. |
| `params[compareDate]` | query | no | string | Start of the comparison range when `compareType` is `custom`. |
| `params[orderTypes][]` | query | no | array | Only these sale types. `renewal` leaves out installment payments. |
| `params[level]` | query | no | string | Pro only. `country` (default), `state` or `city`. |
| `params[country]` | query | no | string | Pro only. Country code to drill into. Needed for `state` and `city`. |
| `params[state]` | query | no | string | Pro only. State to drill into at `city` level. `__unknown__` selects orders with no state. |
| `params[address_type]` | query | no | string | `billing` (default) or `shipping`. Shipping falls back to billing. |
| `params[with_summary]` | query | no | boolean | At `state` or `city` level, also return the store-wide `summary` and `previous` cards. Country level always returns them. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
