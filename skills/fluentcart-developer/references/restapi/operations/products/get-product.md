# GET Get Product

## `GET /products/{product}`

**GET Get Product**

Retrieve a single product by ID.

**Required permission:** `products/view`

- **operationId:** `getProduct`
- **tags:** Products

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `product` | path | yes | integer | The product ID |
| `with[]` | query | no | array | Relations to eager load (e.g., detail, variants, product_menu) |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`products/view`). |
| `422` | Validation failed, or the referenced record does not exist. |
