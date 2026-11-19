# GET Get Installments at Risk

## `GET /reports/installments/at-risk`

**GET Get Installments at Risk**

Returns one page of overdue and lapsed installment plans, largest unpaid balance first. Amounts are in cents.

`search`, `bucket`, `page` and `per_page` are top-level query params, not inside `params`. `reactivate_url` is empty when the user cannot reactivate the plan.

**Permission:** `reports/view` · **Policy:** `ReportPolicy`

- **operationId:** `getInstallmentsAtRisk`
- **tags:** Reports

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `params[currency]` | query | no | string | 3-letter currency code. Defaults to the base currency. `__all__` converts every currency to the base currency. |
| `params[variation_ids][]` | query | no | array | Product variation IDs to filter by. |
| `params[started_from]` | query | no | string | Only plans whose first paid order is on or after this store day (Y-m-d). |
| `params[started_to]` | query | no | string | Only plans whose first paid order is on or before this store day (Y-m-d). |
| `search` | query | no | string | Customer name or email contains this text. |
| `bucket` | query | no | string | Only one bucket. Both when omitted. |
| `page` | query | no | integer | Page number. Default `1`. |
| `per_page` | query | no | integer | Rows per page, 1 to 150. Default `20`. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
