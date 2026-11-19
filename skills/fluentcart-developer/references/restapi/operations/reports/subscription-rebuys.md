# GET Get Subscription Rebuys

## `GET /reports/subscription-rebuys`

**GET Get Subscription Rebuys**

Finds subscriptions whose paid term ended in the range without renewing (canceled or expired) and counts the customers who bought the same product again near that end. `discount_total` and `discount_average` are in decimal currency units (not cents).

A rebuy is a new subscription to the same product, by the same customer, in the same currency, created within `windowDays` before or after the term end. Free trials that never paid and plans changed by an upgrade do not count as ended. `timing` splits rebuys into before the end, within 7 days after, and later. `discounted` counts rebuys that paid less than the old renewal price (same interval, not via a trial); `discount_total` sums the saving. `rebuy_rate` and `discount_average` are `null` when there is nothing to divide.

**Requires FluentCart Pro.** Without Pro this route is not registered and returns 404.

**Permission:** `reports/view` · **Policy:** `ReportPolicy`

- **operationId:** `getSubscriptionRebuys`
- **tags:** Reports

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `params[startDate]` | query | no | string | First day of the range (Y-m-d), store timezone. |
| `params[endDate]` | query | no | string | Last day of the range (Y-m-d), store timezone. |
| `params[rangeKey]` | query | no | string | Preset range. Overrides the dates. |
| `params[currency]` | query | no | string | 3-letter currency code. Default: the base currency. |
| `params[variation_ids][]` | query | no | array | Only orders that contain one of these variation IDs. |
| `params[groupKey]` | query | no | string | Chart bucket size. Default: picked from the range length. |
| `params[windowDays]` | query | no | integer | Days before or after the term end that count as a rebuy, 1-365. Default `30`. |
| `params[billingInterval]` | query | no | string | Only subscriptions with this billing interval, e.g. `monthly`, `yearly`. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
