# GET Get Customer Addresses

## `GET /customers/{customerId}/address`

**GET Get Customer Addresses**

Retrieve addresses for a customer, optionally filtered by address type. Results are sorted with the primary address first.

**Required permission:** `customers/view`

- **operationId:** `getCustomerAddresses`
- **tags:** Customers

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `customerId` | path | yes | integer | The customer ID |
| `type` | query | no | string | Address type filter: billing or shipping (default: billing) |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns customer addresses. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`customers/view`). |
| `422` | Validation failed, or the referenced record does not exist. |
