# GET Get Customer Stats

## `GET /customers/get-stats/{customer}`

**GET Get Customer Stats**

Retrieve widget/stats data for a specific customer. Results are extensible via the fluent_cart/widgets/single_customer filter.

**Required permission:** `customers/view`

- **operationId:** `getCustomerStats`
- **tags:** Customers

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `customer` | path | yes | integer | The customer ID |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns customer widget data. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`customers/view`). |
| `422` | Validation failed, or the referenced record does not exist. |
