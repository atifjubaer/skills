# DELETE Feed

## `DELETE /integration/global-feeds/{integration_id}`

**DELETE Feed**

Permanently delete a global integration feed.

**Required permission:** `integrations/delete`

- **operationId:** `deleteGlobalFeed`
- **tags:** Integrations

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `integration_id` | path | yes | integer | The feed ID to delete |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`integrations/delete`). |
| `422` | Validation failed, or the referenced record does not exist. |
