# POST Change Integration Status

## `POST /products/{product_id}/integrations/feed/change-status`

**POST Change Integration Status**

Enable or disable a product integration feed.

**Also used by the integrations UI.** Toggle a product-level integration feed on or off.

**Required permission:** `products/edit`

- **operationId:** `changeIntegrationStatus`
- **tags:** Products

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `product_id` | path | yes | integer | The product ID |

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "notification_id",
    "status"
  ],
  "properties": {
    "notification_id": {
      "type": "integer",
      "description": "The integration feed ID"
    },
    "status": {
      "type": "string",
      "enum": [
        "yes",
        "no"
      ],
      "description": "yes to enable, no to disable"
    }
  },
  "example": {
    "product_id": 123,
    "notification_id": 10,
    "status": "yes"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. |
| `400` | Missing required parameters |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`products/edit`). |
| `404` | Notification not found |
| `422` | Validation failed, or the referenced record does not exist. |
