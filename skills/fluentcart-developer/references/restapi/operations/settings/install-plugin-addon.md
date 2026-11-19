# POST Install Plugin Addon

## `POST /settings/modules/plugin-addons/install`

**POST Install Plugin Addon**

Install a registered plugin addon from its configured source (WordPress.org, GitHub, or CDN).

**Required permission:** `is_super_admin`

- **operationId:** `installPluginAddon`
- **tags:** Settings

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "plugin_slug"
  ],
  "properties": {
    "plugin_slug": {
      "type": "string",
      "description": "The slug of the addon to install. Must match a registered addon slug.",
      "example": "fluent-cart-elementor-blocks"
    },
    "source_type": {
      "type": "string",
      "description": "Source type: `wordpress`, `github`, or `cdn`. Defaults to the addon's registered source.",
      "enum": [
        "wordpress",
        "github",
        "cdn"
      ],
      "example": "cdn"
    },
    "source_link": {
      "type": "string",
      "description": "URL to the addon source. Defaults to the addon's registered source link.",
      "example": "https://addons-cdn.fluentcart.com/fluent-cart-elementor-blocks.zip"
    },
    "asset_path": {
      "type": "string",
      "description": "GitHub release asset path (defaults to `zipball_url`).",
      "example": "zipball_url"
    }
  },
  "example": {
    "plugin_slug": "fluent-cart-elementor-blocks"
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
