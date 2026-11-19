# POST Save Global Integration Settings

## `POST /integration/global-settings`

**POST Save Global Integration Settings**

Save or update global configuration settings for a specific integration provider (e.g., API keys, authentication credentials).

**Required permission:** `integrations/manage`

- **operationId:** `saveGlobalIntegrationSettings`
- **tags:** Integrations

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "settings_key",
    "integration"
  ],
  "properties": {
    "settings_key": {
      "type": "string",
      "description": "The integration provider key",
      "example": "fluent-crm"
    },
    "integration": {
      "type": "object",
      "description": "The settings data to save (fields vary by provider)",
      "example": {
        "api_key": "your-api-key",
        "api_url": "https://example.com"
      }
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
| `422` | Validation failed, or the referenced record does not exist. |
