# POST Create Shipping Class

## `POST /shipping/classes`

**POST Create Shipping Class**

Create a new shipping class.

**Access policy:** `StoreSensitivePolicy`

**Access policy:** `StoreSensitivePolicy`

- **operationId:** `createShippingClass`
- **tags:** Shipping

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "name",
    "cost",
    "type"
  ],
  "properties": {
    "name": {
      "type": "string",
      "maxLength": 192,
      "description": "Class name (max 192 characters)"
    },
    "cost": {
      "type": "number",
      "minimum": 0,
      "description": "Cost value (minimum: 0). For fixed type, this is a flat amount. For percentage type, this is a percentage value."
    },
    "type": {
      "type": "string",
      "enum": [
        "fixed",
        "percentage"
      ],
      "description": "Cost type: fixed or percentage"
    },
    "per_item": {
      "type": "integer",
      "enum": [
        0,
        1
      ],
      "default": 0,
      "description": "Apply cost per item (1) or per order (0). Default: 0"
    }
  },
  "example": {
    "name": "Oversized Items",
    "cost": 25,
    "type": "fixed",
    "per_item": 1
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Shipping class created successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `422` | Validation failed, or the referenced record does not exist. |
