# GET Get Customer

## `GET /customers/{customerId}`

**GET Get Customer**

Retrieve a single customer by ID with optional eager-loaded relationships.

**Also used by the customer portal UI.** Retrieve the details of the currently authenticated customer. The customerId must match the logged-in customer's record.

**Required permission:** `customers/view`

- **operationId:** `getCustomer`
- **tags:** Customers

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `customerId` | path | yes | integer | The customer ID |
| `with` | query | no | array | Relationships to eager-load (e.g., `orders`, `labels`, `billing_address`, `shipping_address`, `subscriptions`, `wpUser`) |
| `params[customer_only]` | query | no | string | Set to `yes` to return the customer without labels processing |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns the customer object. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Forbidden. The authenticated user does not own this customer record. |
| `404` | Customer not found. |
| `422` | Validation failed, or the referenced record does not exist. |
