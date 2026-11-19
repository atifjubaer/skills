# PUT Update Manage Stock Setting

## `PUT /products/{postId}/update-manage-stock`

**PUT Update Manage Stock Setting**

Enable or disable stock management for a product and all its variants.

**Required permission:** `products/edit`

- **operationId:** `updateManageStock`
- **tags:** Products

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `postId` | path | yes | integer | The product post ID |

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "manage_stock"
  ],
  "properties": {
    "manage_stock": {
      "type": "integer",
      "description": "1 to enable, 0 to disable stock management",
      "enum": [
        0,
        1
      ]
    }
  },
  "example": {
    "manage_stock": 1
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`products/edit`). |
| `422` | Validation failed, or the referenced record does not exist. |
