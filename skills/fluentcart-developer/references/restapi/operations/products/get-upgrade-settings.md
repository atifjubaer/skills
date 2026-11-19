# GET Get Upgrade Settings

## `GET /products/{id}/upgrade-paths`

**GET Get Upgrade Settings**

Retrieve all upgrade path configurations for a product.

**Required permission:** `products/view`

- **operationId:** `getUpgradeSettings`
- **tags:** Products

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `id` | path | yes | integer | The product ID |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`products/view`). |
| `422` | Validation failed, or the referenced record does not exist. |
