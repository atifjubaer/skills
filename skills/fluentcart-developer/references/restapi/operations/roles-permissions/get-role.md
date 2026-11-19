# GET Get Role

## `GET /roles/{key}`

**GET Get Role**

Retrieve details for a specific role by its key. This endpoint is currently a placeholder and returns no data. It is reserved for future use.

**Policy:** `AdminPolicy`

- **operationId:** `getRole`
- **tags:** Roles

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `key` | path | yes | string | Role slug. Valid values come from `PermissionManager::getAllRoles()` — `super_admin`, `manager`, `worker`, `accountant`. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response (currently returns no data) |
| `404` | Unknown or empty role key. |
