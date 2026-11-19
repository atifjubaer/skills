# GET Get Plugin Addons

## `GET /settings/modules/plugin-addons`

**GET Get Plugin Addons**

List all registered plugin addons (e.g., Elementor Blocks) with their installation and activation status.

**Required permission:** `is_super_admin`

- **operationId:** `getPluginAddons`
- **tags:** Settings

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`is_super_admin`). |
