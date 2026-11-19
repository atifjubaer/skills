# DELETE Delete Product

## `DELETE /products/{product}`

**DELETE Delete Product**

Delete a product and all associated data.

**Required permission:** `products/delete`

- **operationId:** `deleteProduct`
- **tags:** Products

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `product` | path | yes | integer | The product ID to delete |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`products/delete`). |
| `422` | Validation failed, or the referenced record does not exist. |
