# GET Get Source Report

## `GET /reports/sources`

**GET Get Source Report**

Returns orders and money grouped by UTM tags, and with FluentCart Pro also by product, variation, period or referrer. Amounts are decimal currency units; `net_sales` is the Revenue report's net sales.

Only orders with the grouped source data count (a `utm_source`, or a referrer for `referrer`), unless `include_none` adds a `(none)` row. UTM values group case-insensitively, with `_`, `-` and spaces treated alike. `totals` come from the order set, not from adding rows. `first_order_net` is the net of first orders (one-time or new subscription); `later_net` is the net of their renewals, any date.

The groupings `product`, `variation`, `day`, `week`, `month` and `referrer` need FluentCart Pro (the `fluent_cart/report/source_groupings` filter); without it they fall back to `campaign_source_medium`. Pro also applies `filter_type` and `advanced_filters` through the `fluent_cart/report/sources_query` filter.

With `page`, one page of rows comes back with `pagination`; a period grouping then also returns every period in `chart`. With a comparison, `fluctuations` is keyed by `utm_key` and holds `previous_<field>` and `<field>_fluctuation` (percent) for `orders`, `gross_sales`, `net_sales`, `average_order`, `average_net_order`; a row new in this period reads `100`.

**Permission:** `reports/view` · **Policy:** `ReportPolicy`

- **operationId:** `getSourceReport`
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
| `params[group_by]` | query | no | string | Grouping. Default `campaign_source_medium`. `product`, `variation`, `day`, `week`, `month`, `referrer` need Pro. |
| `params[include_none]` | query | no | boolean | Add a `(none)` row for orders without source data. |
| `params[page]` | query | no | integer | Page number. Without it, every row comes back. |
| `params[per_page]` | query | no | integer | Rows per page, 10 to 150. Default 50. |
| `params[search]` | query | no | string | Filter rows by label (with `page`). |
| `params[sort_by]` | query | no | string | Sort field (with `page`). |
| `params[sort_order]` | query | no | string | `asc` or `desc` (default). |
| `params[filter_type]` | query | no | string | Pro. Advanced filter mode, passed to the `fluent_cart/report/sources_query` filter. |
| `params[advanced_filters]` | query | no | string | Pro. Advanced filter conditions (JSON), applied by FluentCart Pro. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
