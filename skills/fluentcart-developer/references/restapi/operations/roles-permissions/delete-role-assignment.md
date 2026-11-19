# DELETE Delete Role Assignment

## `DELETE /roles/{key}`

**DELETE Delete Role Assignment**

Remove a FluentCart role assignment from a user. The user's fluent_cart_admin capability is removed and their role meta is deleted. The user's WordPress account is not affected.

**Policy:** `AdminPolicy`

- **operationId:** `deleteRoleAssignment`
- **tags:** Roles

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `key` | path | yes | string | The role key to remove (e.g., manager, worker). |

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
      "description": "The WordPress user ID to remove the role from."
    }
  },
  "example": {
    "user_id": 10
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `400` | Error response |
