# POST Create Custom Order Item

## `POST /orders/{order}/create-custom`

**POST Create Custom Order Item**

Add a custom product/item to an existing order.

**Required permission:** `orders/create`

- **operationId:** `createCustomOrderItem`
- **tags:** Orders

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `order` | path | yes | integer | Order ID |

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "product"
  ],
  "properties": {
    "product": {
      "type": "object",
      "description": "Product data to add as a custom item",
      "properties": {
        "title": {
          "type": "string",
          "description": "Custom item title"
        },
        "price": {
          "type": "number",
          "description": "Item price in cents"
        },
        "quantity": {
          "type": "integer",
          "description": "Item quantity"
        }
      }
    }
  },
  "example": {
    "product": {
      "title": "Custom Service",
      "price": 1500,
      "quantity": 1
    }
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Custom item added successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`orders/create`). |
| `422` | Validation failed, or the referenced record does not exist. |
| `423` | Error processing custom item. |
