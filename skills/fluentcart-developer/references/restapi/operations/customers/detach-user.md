# POST Detach WordPress User

## `POST /customers/{customerId}/detach-user`

**POST Detach WordPress User**

Remove the WordPress user association from a customer record. The customer record itself is preserved; only the user_id link is cleared.

**Required permission:** `customers/manage`

- **operationId:** `detachWordPressUser`
- **tags:** Customers

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `customerId` | path | yes | integer | The customer ID |

### Responses

| Status | Description |
| --- | --- |
| `200` | User detached successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`customers/manage`). |
| `404` | Customer not found. |
| `422` | Validation failed, or the referenced record does not exist. |
