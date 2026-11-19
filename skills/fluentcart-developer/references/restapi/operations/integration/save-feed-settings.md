# POST Save Feed Settings

## `POST /integration/global-feeds/settings`

**POST Save Feed Settings**

Create a new integration feed or update an existing one. Validates required fields defined by the integration provider before saving.

**Required permission:** `integrations/manage`

- **operationId:** `saveFeedSettings`
- **tags:** Integrations

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "integration_name",
    "integration"
  ],
  "properties": {
    "integration_name": {
      "type": "string",
      "description": "The integration provider key (e.g., `fluent-crm`)",
      "example": "fluent-crm"
    },
    "integration_id": {
      "type": "integer",
      "description": "The existing feed ID to update. Omit to create a new feed.",
      "example": 42
    },
    "integration": {
      "type": "string",
      "description": "JSON-encoded feed settings data containing field mappings, conditionals, and configuration",
      "example": "{\"name\":\"Add to customers\",\"enabled\":\"yes\",\"list_id\":\"2\",\"list_name\":\"Customers\",\"merge_fields\":{},\"conditionals\":{\"conditions\":[],\"status\":false,\"type\":\"all\"}}"
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
| `422` | Validation error |
