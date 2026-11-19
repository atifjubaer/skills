# GET Get New vs Returning Customers

## `GET /reports/fetch-new-vs-returning-customer`

**GET Get New vs Returning Customers**

Splits the period's orders by customer type: New, Returning, Renewal, Installment payment, Free order and Guest. Amounts are decimal currency units; `net_sales` is the Revenue report's net sales.

Each order gets one type, checked in this order: a renewal (`Installment payment` for an installment plan, else `Renewal`), `Guest` (no customer), `Free order` (nothing paid), `New` (the customer's first paid purchase), else `Returning`. `Installment payment` and `Free order` rows appear only when such orders exist. `customer_count` counts distinct customers inside one row, so a customer can appear in both `New` and `Returning`.

**Permission:** `reports/view` · **Policy:** `ReportPolicy`

- **operationId:** `getNewVsReturningCustomer`
- **tags:** Reports

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `params[startDate]` | query | no | string | First day of the range, store timezone (`YYYY-MM-DD`). |
| `params[endDate]` | query | no | string | Last day of the range, store timezone (`YYYY-MM-DD`). |
| `params[rangeKey]` | query | no | string | Preset range. Overrides the dates. |
| `params[currency]` | query | no | string | 3-letter currency code. `__all__` converts every currency to the base currency. Default: base currency. |
| `params[filterMode]` | query | no | string | Only live or only test orders. Without it, both count. |
| `params[variation_ids][]` | query | no | array | Only orders that contain these variation IDs. |
| `params[orderTypes][]` | query | no | array | Only these sale types. `renewal` leaves out installment payments. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
