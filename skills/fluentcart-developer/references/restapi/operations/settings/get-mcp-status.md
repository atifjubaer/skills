# GET Get MCP Status

## `GET /settings/mcp`

**GET Get MCP Status**

Return the status payload used by the MCP settings card in the admin: whether the MCP endpoint is enabled, whether the FluentHub adapter plugin is installed/available, the endpoint URL, tool count, and helper links (Application Passwords page, plugins page).

**Required permission:** `is_super_admin`

- **operationId:** `status`
- **tags:** Settings

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns the current MCP status. |
| `401` | Authentication required. |
| `403` | The current user is not a super admin. |
