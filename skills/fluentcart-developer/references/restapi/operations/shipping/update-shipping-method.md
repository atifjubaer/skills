# PUT Update Shipping Method

## `PUT /shipping/methods`

**PUT Update Shipping Method**

Update an existing shipping method. The method ID is passed in the request body.

**Access policy:** `StoreSensitivePolicy`

**Access policy:** `StoreSensitivePolicy`

- **operationId:** `updateShippingMethod`
- **tags:** Shipping

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "method_id",
    "zone_id",
    "title",
    "type"
  ],
  "properties": {
    "method_id": {
      "type": "integer",
      "description": "ID of the shipping method to update"
    },
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
      "description": "Enable/disable the method: 1 (enabled) or 0 (disabled)"
    },
    "states": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Array of state/province codes to restrict this method to. Empty array means all states."
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
    "method_id": 10,
    "zone_id": 1,
    "title": "Express Shipping",
    "type": "flat_rate",
    "amount": "1200",
    "is_enabled": 1,
    "states": [
      "CA",
      "NY",
      "TX",
      "FL"
    ]
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Shipping method updated successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `422` | Validation failed, or the referenced record does not exist. |
