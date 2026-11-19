# POST Activate Plugin Addon

## `POST /settings/modules/plugin-addons/activate`

**POST Activate Plugin Addon**

Activate an already-installed plugin addon.

**Required permission:** `is_super_admin`

- **operationId:** `activatePluginAddon`
- **tags:** Settings

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "plugin_file"
  ],
  "properties": {
    "plugin_file": {
      "type": "string",
      "description": "The plugin file path to activate (e.g., `fluent-cart-elementor-blocks/fluent-cart-elementor-blocks.php`).",
      "example": "fluent-cart-elementor-blocks/fluent-cart-elementor-blocks.php"
    }
  },
  "example": {
    "plugin_file": "fluent-cart-elementor-blocks/fluent-cart-elementor-blocks.php"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`is_super_admin`). |
| `422` | Validation failed, or the referenced record does not exist. |
