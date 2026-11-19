# GET Get Order Mix

## `GET /reports/order-mix`

**GET Get Order Mix**

Splits the period's orders four ways: sale type, order status, discounted orders, and physical orders by shipping status. Counts and percent shares only; no money fields.

Every split adds up to `total`. `share` is a percent of `total`, except `fulfillment.statuses[].share`, which is a percent of `fulfillment.orders` (physical orders only). Orders with no shipping status count as `unshipped`.

**Permission:** `reports/view` · **Policy:** `ReportPolicy`

- **operationId:** `getOrderMix`
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
