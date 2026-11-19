# POST Calculate Shipping

## `POST /orders/calculate-shipping`

**POST Calculate Shipping**

Calculate shipping charges for order items with a specific shipping method.

**Required permissions:** all of `orders/create`, `orders/manage`

- **operationId:** `calculateShipping`
- **tags:** Orders

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "order_items",
    "shipping_id"
  ],
  "properties": {
    "order_items": {
      "type": "array",
      "description": "Array of order items, each with `id` (variation ID) and `quantity`",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "description": "Variation ID"
          },
          "quantity": {
            "type": "integer",
            "description": "Item quantity"
          }
        }
      }
    },
    "shipping_id": {
      "type": "integer",
      "description": "ID of the shipping method to calculate charges for"
    }
  },
  "example": {
    "order_items": [
      {
        "id": 1,
        "quantity": 2
      }
    ],
    "shipping_id": 5
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Shipping calculated successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`orders/create, orders/manage`). |
| `422` | Validation failed, or the referenced record does not exist. |
