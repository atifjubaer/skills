# GET Get Top Sold Products

## `GET /reports/fetch-top-sold-products`

**GET Get Top Sold Products**

Returns the 20 products with the most units sold in the range. `total_amount` is in decimal currency units: the line totals after order-level discounts, before refunds.

With `variation_ids`, only the lines of those variations count (other lines on the same order stay out). `media` is the product thumbnail URL or `null`. `product_name` is the title from the latest order line.

**Permission:** `reports/view` · **Policy:** `ReportPolicy`

- **operationId:** `getTopSoldProducts`
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
