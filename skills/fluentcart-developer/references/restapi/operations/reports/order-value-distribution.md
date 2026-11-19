# GET Get Order Value Distribution

## `GET /reports/order-value-distribution`

**GET Get Order Value Distribution**

Counts the orders in the range by order total, in steps of 100 in the report currency. A bucket key such as `100-200` means a total above 100.00 and up to 200.00 (`total_amount`, cents 10001-20000). Every value is an order count.

**Requires FluentCart Pro.** Without Pro this route is not registered and returns 404.

**Permission:** `reports/view` · **Policy:** `ReportPolicy`

- **operationId:** `getOrderValueDistribution`
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
