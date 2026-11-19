# GET Get Payment Method Disputes

## `GET /reports/payment-methods/disputes`

**GET Get Payment Method Disputes**

Returns disputes per payment gateway, with totals and the previous period's totals. `dispute_amount` is in decimal currency units (not cents). `dispute_rate` is a percent.

`disputed_orders` counts orders placed in the range whose charge was disputed (failed orders included). `disputes_lost` and `dispute_amount` count lost-dispute transactions dated in the range. `dispute_rate` = disputed orders / (orders + failed disputed orders) x 100. A saved-card payment counts under the gateway that charged it.

**Requires FluentCart Pro.** Without Pro this route is not registered and returns 404.

**Permission:** `reports/view` · **Policy:** `ReportPolicy`

- **operationId:** `getPaymentMethodsDisputes`
- **tags:** Reports

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `params[startDate]` | query | no | string | First day of the range (Y-m-d), store timezone. |
| `params[endDate]` | query | no | string | Last day of the range (Y-m-d), store timezone. |
| `params[rangeKey]` | query | no | string | Preset range. Overrides the dates. |
| `params[currency]` | query | no | string | 3-letter currency code, or `__all__` for all currencies converted to the base currency. Default: the base currency. |
| `params[filterMode]` | query | no | string | Live or test orders only. Default: both. |
| `params[variation_ids][]` | query | no | array | Only orders that contain one of these variation IDs. |
| `params[compareType]` | query | no | string | Comparison period type. |
| `params[compareDate]` | query | no | string | Comparison start date (Y-m-d). Needed with `compareType`. |
| `params[orderTypes][]` | query | no | array | Sale types to include. Default: all. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
