# POST Update Zone Order

## `POST /shipping/zones/update-order`

**POST Update Zone Order**

Reorder shipping zones by providing an array of zone IDs in the desired order. Each zone's order field is updated to match its index position.

**Access policy:** `StoreSensitivePolicy`

**Access policy:** `StoreSensitivePolicy`

- **operationId:** `updateZoneOrder`
- **tags:** Shipping

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "zones"
  ],
  "properties": {
    "zones": {
      "type": "array",
      "items": {
        "type": "integer"
      },
      "description": "Array of zone IDs in the desired display order"
    }
  },
  "example": {
    "zones": [
      3,
      1,
      2
    ]
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Zone order updated successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `422` | Invalid data provided. |
