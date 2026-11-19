# POST Remove Shipping Class

## `POST /products/{postId}/shipping-class/remove`

**POST Remove Shipping Class**

Remove the assigned shipping class from a product.

**Required permission:** `products/edit`

- **operationId:** `removeShippingClass`
- **tags:** Products

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `postId` | path | yes | integer | The product post ID |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`products/edit`). |
| `422` | Validation failed, or the referenced record does not exist. |
