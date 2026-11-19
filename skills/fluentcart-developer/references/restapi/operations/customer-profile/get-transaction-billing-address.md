# GET Get Transaction Billing Address

## `GET /customer-profile/orders/{transaction_uuid}/billing-address`

**GET Get Transaction Billing Address**

Retrieve the billing address associated with a specific transaction. Used for invoice/receipt editing in the customer portal.

**Access policy:** `CustomerFrontendPolicy`

**Access policy:** `CustomerFrontendPolicy`

- **operationId:** `getTransactionBillingAddress`
- **tags:** Customer Profile

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `transaction_uuid` | path | yes | string | The UUID of the transaction (alphanumeric with dashes) |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns the billing address data. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `404` | Customer, transaction, or order not found. |
| `422` | Validation failed, or the referenced record does not exist. |
