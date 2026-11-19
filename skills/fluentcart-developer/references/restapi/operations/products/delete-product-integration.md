# DELETE Delete Product Integration

## `DELETE /products/{product_id}/integrations/{integration_id}`

**DELETE Delete Product Integration**

Delete a product integration feed.

**Also used by the integrations UI.** Permanently delete a product-level integration feed.

**Required permission:** `products/delete`

- **operationId:** `deleteProductIntegration`
- **tags:** Products

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `product_id` | path | yes | integer | The product ID |
| `integration_id` | path | yes | integer | The integration feed ID to delete |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`products/delete`). |
| `422` | Validation failed, or the referenced record does not exist. |
