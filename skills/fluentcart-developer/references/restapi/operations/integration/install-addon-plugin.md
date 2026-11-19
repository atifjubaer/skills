# POST Install and Activate Add-on Plugin

## `POST /integration/feed/install-plugin`

**POST Install and Activate Add-on Plugin**

Install and activate a supported integration plugin from the WordPress.org repository. Only whitelisted plugins can be installed through this endpoint.

**Required permission:** `integrations/manage`

- **operationId:** `installAddonPlugin`
- **tags:** Integrations

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "addon"
  ],
  "properties": {
    "addon": {
      "type": "string",
      "description": "The plugin slug to install",
      "enum": [
        "fluent-crm",
        "fluent-smtp",
        "fluent-community",
        "fluent-security",
        "fluentform",
        "fluent-support"
      ],
      "example": "fluent-crm"
    }
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`integrations/manage`). |
| `422` | Addon cannot be installed |
