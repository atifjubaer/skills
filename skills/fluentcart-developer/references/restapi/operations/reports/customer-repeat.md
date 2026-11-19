# GET Get Customer Repeat Purchases

## `GET /reports/customer-repeat`

**GET Get Customer Repeat Purchases**

Returns how many purchases and orders each customer made, and the time to a second purchase. No money fields. Only paid orders (`total_paid` > 0) with a customer count.

`purchases` and `orders` cover customers who paid in the range, over their history up to the range end. Purchases leave out renewals, so a customer who paid only renewals is in bucket `0`; `orders` include renewals. `second_purchase` covers customers gained in the 12 months ending with the range's last month: `repeaters` made another non-renewal purchase, and `median_days` is the median days to it.

**Requires FluentCart Pro.** Without Pro this route is not registered and returns 404.

**Permission:** `reports/view` · **Policy:** `ReportPolicy`

- **operationId:** `getCustomerRepeat`
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

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
