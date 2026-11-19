# GET Get Product Comparison

## `GET /reports/product-comparison`

**GET Get Product Comparison**

Compares up to 6 products or variations side by side: a summary, a chart per period, subscriptions and customer overlap. Summary and chart money fields are in cents; subscription `mrr` values are in decimal currency units.

Each line takes its share of the order's net sales (the Revenue report's net sales). `new_net` comes from non-renewal orders; `renewal_net` and `installment_net` split renewal orders. A $0 order counts as an order, but `customers` and `new_customers` count paid customers only. `overlap` pairs use item indexes: of `from`'s customers in the range, `both` have ever bought `to`, and `to_first` bought `to` first.

**Requires FluentCart Pro.** Without Pro this route is not registered and returns 404.

**Permission:** `reports/view` · **Policy:** `ReportPolicy`

- **operationId:** `getProductComparison`
- **tags:** Reports

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `items[]` | query | yes | array | Item keys, top-level: `p:<product_id>` for a whole product, `v:<variation_id>` for one variation. At most 6; others are dropped. |
| `params[startDate]` | query | no | string | First day of the range (Y-m-d), store timezone. |
| `params[endDate]` | query | no | string | Last day of the range (Y-m-d), store timezone. |
| `params[rangeKey]` | query | no | string | Preset range. Overrides the dates. |
| `params[currency]` | query | no | string | 3-letter currency code, or `__all__` for all currencies converted to the base currency. Default: the base currency. |
| `params[filterMode]` | query | no | string | Live or test orders only. Default: both. |
| `params[variation_ids][]` | query | no | array | Only orders that contain one of these variation IDs. |
| `params[compareType]` | query | no | string | Comparison period type. |
| `params[compareDate]` | query | no | string | Comparison start date (Y-m-d). Needed with `compareType`. |
| `params[groupKey]` | query | no | string | Chart bucket size. Default: picked from the range length. |
| `params[orderTypes][]` | query | no | array | Sale types to include. Default: all. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
