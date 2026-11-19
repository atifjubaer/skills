# GET Search Users

## `GET /roles/user-list`

**GET Search Users**

Search for WordPress users who can be assigned a FluentCart role. Returns users matching the search query, excluding those who already have a WordPress administrator role.

**Policy:** `AdminPolicy`

- **operationId:** `searchUsers`
- **tags:** Roles

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `search` | query | no | string | Search by display name or email address. Partial matches supported. |
| `user_ids` | query | no | string | Comma-separated user IDs to include in results regardless of search filter. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
