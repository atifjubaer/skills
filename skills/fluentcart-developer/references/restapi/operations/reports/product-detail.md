# GET Get Product Detail

## `GET /reports/product-detail`

**GET Get Product Detail**

Returns the detail of one product: its paid orders in the range, the products bought in the same orders, and its subscriptions. Subscription `mrr` values are in decimal currency units (not cents).

Orders count only paid orders (`total_paid` > 0) that are not renewals. `bought_together` lists at most 5 products; `share` is the percent of this product's orders that also hold the other product. `subscriptions` covers every variant of the product: live count and MRR now, and renewals paid and lost in the range. It is `null` when no variant or subscription of the product is found.

**Requires FluentCart Pro.** Without Pro this route is not registered and returns 404.

**Permission:** `reports/view` · **Policy:** `ReportPolicy`

- **operationId:** `getProductDetail`
- **tags:** Reports

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `product_id` | query | yes | integer | The product (post) ID. Top-level, not inside `params`. |
| `params[startDate]` | query | no | string | First day of the range (Y-m-d), store timezone. |
| `params[endDate]` | query | no | string | Last day of the range (Y-m-d), store timezone. |
| `params[rangeKey]` | query | no | string | Preset range. Overrides the dates. |
| `params[currency]` | query | no | string | 3-letter currency code, or `__all__` for all currencies converted to the base currency. Default: the base currency. |
| `params[filterMode]` | query | no | string | Live or test orders only. Default: both. |
| `params[orderTypes][]` | query | no | array | Sale types to include. Default: all. |
| `params[variation_ids][]` | query | no | array | Limit to these variants of the product. Default: all of its variants. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
