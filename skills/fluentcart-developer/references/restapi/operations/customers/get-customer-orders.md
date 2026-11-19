# GET Get Customer Orders

## `GET /customers/{customerId}/orders`

**GET Get Customer Orders**

Retrieve a paginated list of orders belonging to a specific customer. Supports the same filtering and sorting parameters as the main Orders list.

**Also used by the customer portal UI.** Retrieve a paginated list of orders for the specified customer. The customerId must match the logged-in user.

**Required permission:** `customers/view`

- **operationId:** `getCustomerOrders`
- **tags:** Customers

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `customerId` | path | yes | integer | The customer ID |
| `search` | query | no | string | Search orders by invoice number, customer name/email, or order item title |
| `per_page` | query | no | integer | Number of items per page (1-199, default: 10) |
| `page` | query | no | integer | Page number for pagination |
| `sort_by` | query | no | string | Column to sort by (default: id) |
| `sort_type` | query | no | string | Sort direction: asc or desc (default: desc) |
| `filter_type` | query | no | string | Filter mode: simple or advanced (default: simple) |
| `advanced_filters` | query | no | string | JSON-encoded array of advanced filter groups |
| `active_view` | query | no | string | Active tab filter (e.g., on-hold, paid, completed, processing) |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns a paginated list of customer orders. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`customers/view`). |
| `422` | Validation failed, or the referenced record does not exist. |
