# POST Update Shipping Class

## `POST /products/{postId}/shipping-class`

**POST Update Shipping Class**

Assign a shipping class to a product.

**Required permission:** `products/edit`

- **operationId:** `updateShippingClass`
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
    "shipping_class"
  ],
  "properties": {
    "shipping_class": {
      "type": "integer",
      "description": "Shipping class ID"
    }
  },
  "example": {
    "shipping_class": 3
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
