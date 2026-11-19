# PUT Update Order Address

## `PUT /orders/{order}/address/{id}`

**PUT Update Order Address**

Update an existing order address (billing or shipping) with new address data.

**Required permission:** `orders/manage`

- **operationId:** `updateOrderAddress`
- **tags:** Orders

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `order` | path | yes | integer | Order ID |
| `id` | path | yes | integer | Order address ID |

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "order_id"
  ],
  "properties": {
    "order_id": {
      "type": "integer",
      "description": "Order ID (must match the path parameter)"
    },
    "name": {
      "type": "string",
      "description": "Full name"
    },
    "first_name": {
      "type": "string",
      "description": "First name"
    },
    "last_name": {
      "type": "string",
      "description": "Last name"
    },
    "full_name": {
      "type": "string",
      "description": "Full name"
    },
    "address_1": {
      "type": "string",
      "description": "Address line 1"
    },
    "address_2": {
      "type": "string",
      "description": "Address line 2"
    },
    "city": {
      "type": "string",
      "description": "City"
    },
    "state": {
      "type": "string",
      "description": "State/province"
    },
    "postcode": {
      "type": "string",
      "description": "Postal/ZIP code"
    },
    "country": {
      "type": "string",
      "description": "Country code"
    }
  },
  "example": {
    "order_id": 42,
    "first_name": "John",
    "last_name": "Doe",
    "address_1": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postcode": "10001",
    "country": "US"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Address updated successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`orders/manage`). |
| `404` | Address information does not match. |
| `422` | Validation failed, or the referenced record does not exist. |
