# POST Create Shipping Method

## `POST /shipping/methods`

**POST Create Shipping Method**

Create a new shipping method within a shipping zone.

**Access policy:** `StoreSensitivePolicy`

**Access policy:** `StoreSensitivePolicy`

- **operationId:** `createShippingMethod`
- **tags:** Shipping

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "zone_id",
    "title",
    "type"
  ],
  "properties": {
    "zone_id": {
      "type": "integer",
      "description": "ID of the parent shipping zone"
    },
    "title": {
      "type": "string",
      "maxLength": 192,
      "description": "Method display title (max 192 characters)"
    },
    "type": {
      "type": "string",
      "maxLength": 192,
      "description": "Shipping method type (e.g., flat_rate, free_shipping, local_pickup)"
    },
    "amount": {
      "type": "string",
      "description": "Shipping cost in cents (e.g., 500 for $5.00)"
    },
    "is_enabled": {
      "type": "integer",
      "enum": [
        0,
        1
      ],
      "default": 1,
      "description": "Enable/disable the method: 1 (enabled) or 0 (disabled)"
    },
    "states": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Array of state/province codes to restrict this method to (e.g., [\"CA\", \"NY\"]). Empty array means all states."
    },
    "settings": {
      "type": "object",
      "properties": {
        "configure_rate": {
          "type": "string",
          "description": "Rate configuration type"
        },
        "class_aggregation": {
          "type": "string",
          "description": "How shipping classes are aggregated"
        }
      },
      "description": "Additional settings for the method"
    },
    "meta": {
      "type": "object",
      "additionalProperties": {
        "type": "string"
      },
      "description": "Additional metadata key-value pairs (string values only)"
    }
  },
  "example": {
    "zone_id": 1,
    "title": "Standard Shipping",
    "type": "flat_rate",
    "amount": "500",
    "is_enabled": 1,
    "states": [
      "CA",
      "NY"
    ],
    "settings": {
      "configure_rate": "per_order",
      "class_aggregation": "per_class"
    }
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Shipping method created successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `422` | Validation failed, or the referenced record does not exist. |
