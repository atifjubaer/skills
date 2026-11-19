# PUT Update Shipping Zone

## `PUT /shipping/zones/{id}`

**PUT Update Shipping Zone**

Update an existing shipping zone. If the region changes, all associated shipping method states are reset to empty.

**Access policy:** `StoreSensitivePolicy`

**Access policy:** `StoreSensitivePolicy`

- **operationId:** `updateShippingZone`
- **tags:** Shipping

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `id` | path | yes | integer | The shipping zone ID |

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
      "description": "ISO 3166-1 alpha-2 country code or 'all'. Only one 'all' zone is allowed."
    },
    "order": {
      "type": "integer",
      "description": "Sort order for display priority"
    }
  },
  "example": {
    "name": "United States",
    "region": "US",
    "order": 0
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Shipping zone updated successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `422` | Validation failed, or the referenced record does not exist. |
