# GET Get Product Integration Feeds

## `GET /products/{productId}/integrations`

**GET Get Product Integration Feeds**

Retrieve all integration feeds configured for a product, along with available integrations.

**Also used by the integrations UI.** Retrieve all integration feeds configured for a specific product, along with available product-scoped integrations.

**Required permission:** `products/view`

- **operationId:** `getProductIntegrationFeeds`
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
