# POST Remove Tax Class

## `POST /products/{postId}/tax-class/remove`

**POST Remove Tax Class**

Remove the assigned tax class from a product.

**Required permission:** `products/edit`

- **operationId:** `removeTaxClass`
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
