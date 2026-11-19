# GET Get Source Channels

## `GET /reports/source-channels`

**GET Get Source Channels**

Returns the new customers won per marketing channel (email, paid, social, AI, search, referral, campaign, direct) with first-order net, lifetime value, repeat and refund rates, tracking coverage and a chart. Amounts are integers in cents; net figures are the Revenue report's net sales.

A new customer is one whose first paid purchase falls in the range. The channel comes from the store's own rules first, then the UTM tags, then the referrer. Custom channel rules come from FluentCart Pro (the `fluent_cart/report/channel_rules` filter); custom channels come first, with their `label`; built-in channels have `label` `null`. Pro's `filter_type` and `advanced_filters` apply here too. `coverage.tracked` is customers not in `direct`. `chart[]` holds new customers per channel key per bucket.

**Permission:** `reports/view` · **Policy:** `ReportPolicy`

- **operationId:** `getSourceChannels`
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
| `params[orderTypes][]` | query | no | array | Only these sale types. `renewal` leaves out installment payments. |
| `params[filter_type]` | query | no | string | Pro. Advanced filter mode, passed to the `fluent_cart/report/sources_query` filter. |
| `params[advanced_filters]` | query | no | string | Pro. Advanced filter conditions (JSON), applied by FluentCart Pro. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
