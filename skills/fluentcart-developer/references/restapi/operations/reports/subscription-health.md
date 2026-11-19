# GET Get Subscription Health

## `GET /reports/subscription-health`

**GET Get Subscription Health**

Returns subscription health now: MRR, live subscriptions, ARPU and the count and MRR of active, discounted, trial, canceling, failing and paused plans. MRR values are decimals.

Open-ended plans only. The date range does not apply. With `params[cached]=1` the result may come from a 10-minute cache.

**Permission:** `reports/view` · **Policy:** `ReportPolicy`

- **operationId:** `getSubscriptionHealth`
- **tags:** Reports

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `params[currency]` | query | no | string | 3-letter currency code. Defaults to the base currency. `__all__` converts every currency to the base currency. |
| `params[variation_ids][]` | query | no | array | Product variation IDs to filter by. |
| `params[cached]` | query | no | integer | When `1`, the result may come from a 10-minute cache. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
