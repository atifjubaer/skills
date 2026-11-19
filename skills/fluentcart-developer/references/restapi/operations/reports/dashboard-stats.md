# GET Get Dashboard Stats

## `GET /reports/dashboard-stats`

**GET Get Dashboard Stats**

Returns four order tiles for a date range and for the previous period of the same length: all orders, paid orders, paid order items and paid order value. The paid order value is in cents.

"Paid" means the report statuses: paid, partially paid, refunded and partially refunded. The order value is `SUM(total_paid)`, not net sales. With no dates the range runs from the first order to today. One currency only: the base currency when `params[currency]` is empty. The admin Orders page stat bar reads this endpoint; the Dashboard page tiles come from `GET /dashboard/stats`.

**Permission:** `reports/view` · **Policy:** `ReportPolicy`

- **operationId:** `getDashboardStats`
- **tags:** Reports

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `params[startDate]` | query | no | string | First store day of the range (Y-m-d). |
| `params[endDate]` | query | no | string | Last store day of the range (Y-m-d). |
| `params[currency]` | query | no | string | 3-letter currency code. Defaults to the base currency. `__all__` is not supported. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
