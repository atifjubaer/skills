# GET Get Payment Methods

## `GET /reports/payment-methods`

**GET Get Payment Methods**

Returns orders, money, refunds, failures and failing subscriptions per payment gateway, the totals, the previous period's totals and net sales by gateway over time. Amounts are decimal currency units; `net_sales` is the Revenue report's net sales.

A saved-card payment counts under the gateway that charged it. Disputes per gateway and sales by card brand are FluentCart Pro reports (`reports/payment-methods/disputes`, `reports/payment-methods/methods`); this endpoint removes the dispute fields from `rows` and `previous`, and keeps only `totals.dispute_rate`. `failing_subscriptions` and `mrr_at_risk` describe open-ended subscriptions failing or past due now, with no date filter. `success_rate` = orders / (orders + recorded failed charges). `previous` is `null` without a comparison.

**Permission:** `reports/view` · **Policy:** `ReportPolicy`

- **operationId:** `getPaymentMethods`
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
