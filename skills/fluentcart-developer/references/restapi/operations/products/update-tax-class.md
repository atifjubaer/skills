# POST Update Tax Class

## `POST /products/{postId}/tax-class`

**POST Update Tax Class**

Assign a tax class to a product.

**Required permission:** `products/edit`

- **operationId:** `updateTaxClass`
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
    "tax_class"
  ],
  "properties": {
    "tax_class": {
      "type": "integer",
      "description": "Tax class ID"
    }
  },
  "example": {
    "tax_class": 5
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
