# POST Create Shipping Zone

## `POST /shipping/zones`

**POST Create Shipping Zone**

Create a new shipping zone.

**Access policy:** `StoreSensitivePolicy`

**Access policy:** `StoreSensitivePolicy`

- **operationId:** `createShippingZone`
- **tags:** Shipping

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "name"
  ],
  "properties": {
    "name": {
      "type": "string",
      "maxLength": 192,
      "description": "Zone name (max 192 characters)"
    },
    "region": {
      "type": "string",
      "description": "ISO 3166-1 alpha-2 country code (e.g., US, GB) or 'all' for worldwide. Only one 'all' zone is allowed."
    },
    "order": {
      "type": "integer",
      "description": "Sort order for display priority"
    }
  },
  "example": {
    "name": "Europe",
    "region": "DE",
    "order": 2
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Shipping zone created successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `422` | Validation failed, or the referenced record does not exist. |
