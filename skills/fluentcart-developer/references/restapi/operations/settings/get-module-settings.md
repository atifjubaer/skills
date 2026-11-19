# GET Get Module Settings

## `GET /settings/modules`

**GET Get Module Settings**

Retrieve all module (feature toggle) settings and their field definitions.

**Required permission:** `is_super_admin`

- **operationId:** `getModuleSettings`
- **tags:** Settings

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`is_super_admin`). |
