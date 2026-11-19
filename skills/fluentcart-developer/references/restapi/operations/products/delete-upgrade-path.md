# DELETE Delete Upgrade Path

## `DELETE /products/upgrade-path/{id}/delete`

**DELETE Delete Upgrade Path**

Delete an upgrade path.

**Required permission:** `products/delete`

- **operationId:** `deleteUpgradePath`
- **tags:** Products

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `id` | path | yes | integer | The upgrade path ID |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`products/delete`). |
| `422` | Validation failed, or the referenced record does not exist. |
