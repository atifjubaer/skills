# POST Create and Change Customer

## `POST /orders/{order_id}/create-and-change-customer`

**POST Create and Change Customer**

Create a new customer and immediately assign them to the order. Combines customer creation with order reassignment.

**Required permission:** `orders/manage`

- **operationId:** `createAndChangeCustomer`
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
    "email"
  ],
  "properties": {
    "first_name": {
      "type": "string",
      "description": "Customer first name (max 255 chars). Required if full name mode is disabled"
    },
    "last_name": {
      "type": "string",
      "description": "Customer last name (max 255 chars)"
    },
    "full_name": {
      "type": "string",
      "description": "Customer full name (max 255 chars). Required if full name mode is enabled"
    },
    "email": {
      "type": "string",
      "format": "email",
      "description": "Customer email address (max 255 chars, must be unique)"
    },
    "city": {
      "type": "string",
      "description": "Customer city"
    },
    "user_id": {
      "type": "integer",
      "description": "WordPress user ID to link"
    },
    "status": {
      "type": "string",
      "description": "Customer status"
    },
    "country": {
      "type": "string",
      "description": "Customer country"
    },
    "state": {
      "type": "string",
      "description": "Customer state"
    },
    "postcode": {
      "type": "string",
      "description": "Customer postal code"
    },
    "notes": {
      "type": "string",
      "description": "Customer notes"
    }
  },
  "example": {
    "first_name": "Jane",
    "last_name": "Doe",
    "email": "jane@example.com"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Customer created and assigned successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`orders/manage`). |
| `422` | Validation error. |
