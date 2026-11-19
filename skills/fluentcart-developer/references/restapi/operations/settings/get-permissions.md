# GET Get Permissions

## `GET /settings/permissions`

**GET Get Permissions**

Retrieve the current role-to-capability permission mappings for FluentCart.

**Also used by the roles & permissions UI.** Retrieve a list of available WordPress roles and the currently configured capability permissions.

**Required permission:** `is_super_admin`

- **operationId:** `getPermissions`
- **tags:** Settings

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`is_super_admin`). |
