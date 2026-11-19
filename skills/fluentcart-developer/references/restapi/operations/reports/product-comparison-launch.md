# GET Get Product Comparison Since Launch

## `GET /reports/product-comparison-launch`

**GET Get Product Comparison Since Launch**

For each compared item, returns net sales and units per store month from its launch month. `net` is in cents and uses the Revenue report's net sales. The date range is ignored.

The launch month is the first of three months in a row with net sales; a younger item launches with its first month with net sales. Months run to the item's last month with a sale, at most 60. `launched_at` and `months` are empty when the item has no paid sale.

**Requires FluentCart Pro.** Without Pro this route is not registered and returns 404.

**Permission:** `reports/view` · **Policy:** `ReportPolicy`

- **operationId:** `getProductComparisonLaunch`
- **tags:** Reports

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `items[]` | query | yes | array | Item keys, top-level: `p:<product_id>` or `v:<variation_id>`. At most 6. |
| `params[currency]` | query | no | string | 3-letter currency code, or `__all__` for all currencies converted to the base currency. Default: the base currency. |
| `params[filterMode]` | query | no | string | Live or test orders only. Default: both. |
| `params[orderTypes][]` | query | no | array | Sale types to include. Default: all. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
