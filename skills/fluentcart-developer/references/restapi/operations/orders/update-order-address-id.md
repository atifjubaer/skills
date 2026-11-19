# POST Update Order Address ID

## `POST /orders/{order_id}/update-address-id`

**POST Update Order Address ID**

Assign an existing customer address to an order's billing or shipping address.

**Required permission:** `orders/manage`

- **operationId:** `updateOrderAddressId`
- **tags:** Orders

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `order_id` | path | yes | integer | Order ID |

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "address_id"
  ],
  "properties": {
    "address_id": {
      "type": "integer",
      "description": "Customer address ID to assign"
    },
    "address_type": {
      "type": "string",
      "description": "Address type: `billing` (default) or `shipping`",
      "enum": [
        "billing",
        "shipping"
      ],
      "default": "billing"
    }
  },
  "example": {
    "address_id": 5,
    "address_type": "billing"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Address updated successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`orders/manage`). |
| `404` | Order not found. |
| `422` | Validation failed, or the referenced record does not exist. |
