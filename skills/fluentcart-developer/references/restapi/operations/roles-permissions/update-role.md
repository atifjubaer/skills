# POST Update Role

## `POST /roles/{key}`

**POST Update Role**

Update a specific role definition. This endpoint is currently a placeholder and returns no data. It is reserved for future use.

**Policy:** `AdminPolicy`

- **operationId:** `updateRole`
- **tags:** Roles

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `key` | path | yes | string | The role key to update. |

### Request body

`application/json`

```json
{
  "type": "object",
  "example": {
    "title": "Manager",
    "capabilities": [
      "manage_orders",
      "manage_products",
      "manage_customers",
      "manage_coupons"
    ]
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response (currently returns no data) |
