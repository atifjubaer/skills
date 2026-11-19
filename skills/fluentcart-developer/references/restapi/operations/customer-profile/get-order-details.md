# GET Get Order Details

## `GET /customer-profile/orders/{order_uuid}`

**GET Get Order Details**

Retrieve full details for a specific order including line items, transactions, subscriptions, downloads, and addresses. The order must belong to the authenticated customer.

**Access policy:** `CustomerFrontendPolicy`

**Access policy:** `CustomerFrontendPolicy`

- **operationId:** `getOrderDetails`
- **tags:** Customer Profile

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `order_uuid` | path | yes | string | The UUID of the order (alphanumeric with dashes) |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns full order details. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Not logged in. |
| `404` | Order not found. |
| `422` | Validation failed, or the referenced record does not exist. |
