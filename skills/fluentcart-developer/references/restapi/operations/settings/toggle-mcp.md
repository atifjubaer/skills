# POST Toggle MCP

## `POST /settings/mcp/toggle`

**POST Toggle MCP**

Flip the master switch that enables or disables the FluentCart MCP server for AI agents. Writes the same option key the server boot guard reads, so a disabled state immediately blocks further MCP requests. The response reports the actually-persisted state rather than the requested value.

**Required permission:** `is_super_admin`

- **operationId:** `toggle`
- **tags:** Settings

### Request body

`application/json`

```json
{
  "type": "object",
  "properties": {
    "mcp_enabled": {
      "description": "Desired MCP state. Accepts a boolean, or the strings `yes`, `true`, `1`, `on` (case-insensitive) to enable; any other value disables.",
      "example": "yes"
    }
  },
  "example": {
    "mcp_enabled": "yes"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns the persisted MCP state. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`is_super_admin`). |
| `422` | The current user cannot manage_options, so the setting was not changed. |
