# GET Get Installments by Variation

## `GET /reports/installments/variations`

**GET Get Installments by Variation**

Returns installment plans grouped by the variation they were sold on: how many started, what they collected, and what is still owed. Amounts are in cents.

`collected` is paid less refunded on the plans' orders. `scheduled` is still owed on running plans, `overdue_amount` on overdue plans, `lapsed_amount` on lapsed plans. `total` = `collected` + `scheduled`; rows sort by it. Each plan falls in one `<bucket>_count`: completed, running, overdue, paused, upgraded, lapsed, refunded.

**Requires FluentCart Pro.** Without Pro this route is not registered and returns 404.

**Permission:** `reports/view` · **Policy:** `ReportPolicy`

- **operationId:** `getInstallmentsVariations`
- **tags:** Reports

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `params[currency]` | query | no | string | 3-letter currency code, or `__all__` for all currencies converted to the base currency. Default: the base currency. |
| `params[variation_ids][]` | query | no | array | Only orders that contain one of these variation IDs. |
| `params[started_from]` | query | no | string | Only plans that started on or after this day (Y-m-d, store timezone). |
| `params[started_to]` | query | no | string | Only plans that started on or before this day (Y-m-d, store timezone). |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
