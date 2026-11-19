# GET Find Customer Order

## `GET /customers/{customerId}/order`

**GET Find Customer Order**

Retrieve all orders for a customer with their filtered order items (line items) eager-loaded.

**Required permission:** `customers/view`

- **operationId:** `findCustomerOrder`
- **tags:** Customers

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `customerId` | path | yes | integer | The customer ID |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns customer orders with line items. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`customers/view`). |
| `422` | Validation failed, or the referenced record does not exist. |
