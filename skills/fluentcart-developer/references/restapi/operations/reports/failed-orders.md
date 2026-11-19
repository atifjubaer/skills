# GET Get Failed Orders

## `GET /reports/failed-orders`

**GET Get Failed Orders**

Returns how many orders created in the range have the `failed` payment status, and the latest 10 of them. `total_amount` is in decimal currency units.

The payment status filter is always `failed` here. `created_at` is the order's GMT time. In `__all__` mode `total_amount` is converted to the base currency.

**Permission:** `reports/view` · **Policy:** `ReportPolicy`

- **operationId:** `getFailedOrders`
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
