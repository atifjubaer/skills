# POST Chained Data Request

## `POST /integration/feed/chained`

**POST Chained Data Request**

Handle chained/dependent data requests for integration feeds. Used when selecting a value in one feed field needs to dynamically load options for another field. The behavior is entirely handled by the integration provider through the `fluent_cart/integration/chained_{route}` hook.

**Required permission:** `integrations/manage`

- **operationId:** `chainedDataRequest`
- **tags:** Integrations

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "route"
  ],
  "properties": {
    "route": {
      "type": "string",
      "description": "The chained route identifier, determines which integration provider handles the request",
      "example": "fluent-crm"
    }
  },
  "additionalProperties": true,
  "example": {
    "route": "fluent-crm",
    "list_id": "2"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. The response format depends on the integration provider handling the chained route. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`integrations/manage`). |
| `422` | Validation failed, or the referenced record does not exist. |
