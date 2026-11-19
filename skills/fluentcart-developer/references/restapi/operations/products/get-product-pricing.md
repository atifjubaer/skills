# GET Get Product Pricing

## `GET /products/{productId}/pricing`

**GET Get Product Pricing**

Retrieve the full product details including pricing, variants, downloadable files, and taxonomy information.

**Required permission:** `products/view`

- **operationId:** `getProductPricing`
- **tags:** Products

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `productId` | path | yes | integer | The product ID |
| `with[]` | query | no | array | Additional relations (e.g., product_menu) |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`products/view`). |
| `422` | Validation failed, or the referenced record does not exist. |
