# POST Save Permissions

## `POST /settings/permissions`

**POST Save Permissions**

Update the role-to-capability permission mappings for FluentCart.

**Also used by the roles & permissions UI.** Update which WordPress roles have access to FluentCart.

**Required permission:** `is_super_admin`

- **operationId:** `savePermissions`
- **tags:** Settings

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "capability"
  ],
  "properties": {
    "capability": {
      "type": "object",
      "description": "An object mapping WordPress role slugs to their FluentCart capability assignments.",
      "additionalProperties": {
        "type": "object",
        "additionalProperties": {
          "type": "boolean"
        }
      }
    }
  },
  "example": {
    "capability": {
      "shop_manager": {
        "orders/view": true,
        "orders/manage": true,
        "customers/view": true,
        "customers/manage": true,
        "products/manage": true,
        "coupons/manage": true,
        "subscriptions/view": false,
        "settings/manage": false
      },
      "editor": {
        "orders/view": true,
        "orders/manage": false,
        "customers/view": true,
        "products/manage": false
      }
    }
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Forbidden - User doesn't have manage_options capability |
| `422` | Validation failed, or the referenced record does not exist. |
