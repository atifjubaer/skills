# POST Install MCP Adapter

## `POST /settings/mcp/install-adapter`

**POST Install MCP Adapter**

Trigger a one-click install of the FluentHub adapter plugin, which is required for the MCP endpoint to work. The free FluentCart plugin can only detect and trigger this install — the actual installer logic lives in a Fluent Pro plugin (FluentCart Pro, or any other Fluent product) that hooks the `fluent_toolkit/*` contract. If no Pro plugin is active, this returns the manual download link instead of installing anything.

**Required permission:** `is_super_admin`

- **operationId:** `installAdapter`
- **tags:** Settings

### Responses

| Status | Description |
| --- | --- |
| `200` | FluentHub installed and activated, or a manual-install link was returned. |
| `401` | Authentication required. |
| `403` | The current user is not a super admin. |
| `422` | Either the current WordPress user lacks the `install_plugins` capability (regardless of the `is_super_admin` route policy — the controller re-checks independently), or no Pro plugin supports automatic install and a manual download link is returned instead. Both cases use the framework's default `sendError()` status of 422; distinguish them by the presence of `toolkit_download_url`. |
