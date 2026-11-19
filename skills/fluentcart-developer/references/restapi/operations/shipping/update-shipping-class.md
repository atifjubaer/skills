# PUT Update Shipping Class

## `PUT /shipping/classes/{id}`

**PUT Update Shipping Class**

Update an existing shipping class.

**Access policy:** `StoreSensitivePolicy`

**Access policy:** `StoreSensitivePolicy`

- **operationId:** `updateShippingClass`
- **tags:** Shipping

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `id` | path | yes | integer | The shipping class ID |

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
      "description": "Cost value (minimum: 0)"
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
    "name": "Heavy Items",
    "cost": 20,
    "type": "fixed",
    "per_item": 1
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Shipping class updated successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `422` | Validation failed, or the referenced record does not exist. |
