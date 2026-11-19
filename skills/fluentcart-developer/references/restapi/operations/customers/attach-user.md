# POST Attach WordPress User

## `POST /customers/{customerId}/attachable-user`

**POST Attach WordPress User**

Link a WordPress user to an existing customer record. The customer must not already have a linked user, and the target user must not already be linked to another customer.

**Required permission:** `customers/manage`

- **operationId:** `attachWordPressUser`
- **tags:** Customers

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `customerId` | path | yes | integer | The customer ID |

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "user_id"
  ],
  "properties": {
    "user_id": {
      "type": "integer",
      "description": "The WordPress user ID to attach. Must reference an existing user who is not already linked to a customer."
    }
  },
  "example": {
    "user_id": 8
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | User attached successfully. |
| `400` | Cannot attach user. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`customers/manage`). |
| `422` | Validation failed, or the referenced record does not exist. |
