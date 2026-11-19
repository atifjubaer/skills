# GET Get Future Renewals

## `GET /reports/future-renewals`

**GET Get Future Renewals**

Projects the renewals of live open-ended subscriptions month by month for the next 3, 6 or 12 months, with the store's renewal rates for the last 12 months. Amounts are in cents.

The date range does not apply; the window starts on the as-of day and ends at the end of the horizon's last month. `by_variation` comes only when FluentCart Pro answers the `fluent_cart/report/future_renewals_by_variation` filter. In `by_interval` and `trial`, the inner key is the renewal's position in the window.

**Permission:** `reports/view` · **Policy:** `ReportPolicy`

- **operationId:** `getFutureRenewals`
- **tags:** Reports

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `params[currency]` | query | no | string | 3-letter currency code. Defaults to the base currency. `__all__` converts every currency to the base currency. |
| `params[variation_ids][]` | query | no | array | Product variation IDs to filter by. |
| `params[horizon]` | query | no | string | Months to project. Default `3`. |
| `params[as_of]` | query | no | string | Start day (Y-m-d). Defaults to today. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
