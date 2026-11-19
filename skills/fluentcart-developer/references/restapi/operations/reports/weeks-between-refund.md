# GET Get Weeks Between Refund

## `GET /reports/weeks-between-refund`

**GET Get Weeks Between Refund**

Counts orders by the weeks from the order to its first refund. The range applies to the date of the first refund, not the order date. A refund on day 0 to 7 is week 1. No money fields.

**Requires FluentCart Pro.** Without Pro this route is not registered and returns 404.

**Permission:** `reports/view` · **Policy:** `ReportPolicy`

- **operationId:** `getWeeksBetweenRefund`
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
