# POST Recalculate Lifetime Value

## `POST /customers/{customerId}/recalculate-ltv`

**POST Recalculate Lifetime Value**

Recalculate a customer's lifetime value (LTV) by summing net payments from all successful orders. Also updates purchase_count, first_purchase_date, last_purchase_date, and aov (average order value).

**Required permission:** `customers/manage`

- **operationId:** `recalculateCustomerLtv`
- **tags:** Customers

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `customerId` | path | yes | integer | The customer ID |

### Responses

| Status | Description |
| --- | --- |
| `200` | Lifetime value recalculated successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`customers/manage`). |
| `404` | Customer not found. |
| `422` | Validation failed, or the referenced record does not exist. |
