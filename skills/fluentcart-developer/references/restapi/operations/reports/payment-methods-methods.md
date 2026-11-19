# GET Get Payment Method Types

## `GET /reports/payment-methods/methods`

**GET Get Payment Method Types**

Returns net sales by the card brand or payment method type that each order's charge recorded (Visa, PayPal, SEPA Direct Debit, ...). `net_sales` is in decimal currency units (not cents) and uses the Revenue report's net sales.

Orders with no recognised brand or method are left out of `rows`. `orders` is the number of orders that had one, and `coverage` is that number as a percent of all report orders in the range. `net_share` is a percent of the net sales in `rows`.

**Requires FluentCart Pro.** Without Pro this route is not registered and returns 404.

**Permission:** `reports/view` · **Policy:** `ReportPolicy`

- **operationId:** `getPaymentMethodsMethods`
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
| `params[orderTypes][]` | query | no | array | Sale types to include. Default: all. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
