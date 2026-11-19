# GET Get Bundle Info

## `GET /products/get-bundle-info/{productId}`

**GET Get Bundle Info**

Retrieve bundle configuration information for a product, including child variant mappings.

**Required permission:** `products/view`

- **operationId:** `getBundleInfo`
- **tags:** Products

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `productId` | path | yes | integer | The product ID |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`products/view`). |
| `422` | Validation failed, or the referenced record does not exist. |
