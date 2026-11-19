# GET List Renewal Invoices

## `GET /renewals`

**GET List Renewal Invoices**

List orders of type `renewal` (subscription renewal invoices), newest first, paginated. Each row includes its customer relation.

**Required permission:** `orders/view`

- **operationId:** `index`
- **tags:** Orders

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `payment_status` | query | no | string | Filter by payment status (e.g. paid, pending, failed). |
| `parent_id` | query | no | integer | Filter to renewal invoices belonging to a specific parent order ID. |
| `customer_id` | query | no | integer | Filter to renewal invoices belonging to a specific customer ID. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns a paginated list of renewal invoices. |
| `401` | Authentication required. |
| `403` | The current user lacks the orders/view permission. |
