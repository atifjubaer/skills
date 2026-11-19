# GET Get Store Settings

## `GET /settings/store`

**GET Get Store Settings**

Retrieve all store configuration settings along with the field schema for a given settings tab.

**Required permission:** `store/settings`

- **operationId:** `getStoreSettings`
- **tags:** Settings

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `settings_name` | query | no | string | The settings tab to return fields for (e.g., `store_setup`, `checkout`, `pages`). |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`store/settings`). |
