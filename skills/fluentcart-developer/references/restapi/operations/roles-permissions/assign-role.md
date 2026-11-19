# POST Assign Role

## `POST /roles`

**POST Assign Role**

Assign a FluentCart role to a WordPress user. The user receives the fluent_cart_admin capability and their role is stored as user meta. If the user already has an assigned role, it is replaced.

**Policy:** `AdminPolicy`

- **operationId:** `assignRole`
- **tags:** Roles

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "user_id",
    "role_key"
  ],
  "properties": {
    "user_id": {
      "type": "integer",
      "description": "WordPress user ID. Must reference an existing user."
    },
    "role_key": {
      "type": "string",
      "maxLength": 50,
      "description": "The role key to assign. Must be one of the valid role keys returned by the List Roles endpoint (e.g., super_admin, manager, worker, accountant)."
    }
  },
  "example": {
    "user_id": 10,
    "role_key": "manager"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `400` | Error response |
