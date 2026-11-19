# GET Get MCP Config Snippets

## `GET /settings/mcp/config-snippets`

**GET Get MCP Config Snippets**

Return ready-to-paste MCP connection snippets for every supported client (Claude Code, Claude Desktop, Cursor, Codex, and a generic HTTP snippet), built server-side in one response. No credentials are ever included — each snippet carries a placeholder for the WordPress username and Application Password that the caller fills in themselves.

**Required permission:** `is_super_admin`

- **operationId:** `getConfigSnippets`
- **tags:** Settings

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `local_dev` | query | no | string | Overrides TLS-verification guidance in the Claude Desktop snippet. Truthy values (yes, true, 1, on) are treated as a local/dev environment. When omitted, the server auto-detects. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns connection snippets for every supported MCP client. |
| `401` | Authentication required. |
| `403` | The current user is not a super admin. |
