# POST Save Module Settings

## `POST /settings/modules`

**POST Save Module Settings**

Enable or disable modules (features) and update their configuration. Fires `fluent_cart/module/activated/{key}` or `fluent_cart/module/deactivated/{key}` hooks when a module's active status changes.

**Required permission:** `is_super_admin`

- **operationId:** `saveModuleSettings`
- **tags:** Settings

### Request body

`application/json`

```json
{
  "type": "object",
  "description": "Module key-value pairs. Each module object contains an `active` field. Only keys returned by `ModuleSettings::validKeys()` are accepted.",
  "additionalProperties": {
    "type": "object",
    "properties": {
      "active": {
        "type": "string",
        "enum": [
          "yes",
          "no"
        ],
        "description": "Whether the module is enabled."
      }
    },
    "required": [
      "active"
    ]
  },
  "example": {
    "shipping": {
      "active": "yes"
    },
    "tax": {
      "active": "no"
    },
    "coupons": {
      "active": "yes"
    },
    "subscriptions": {
      "active": "yes"
    },
    "licensing": {
      "active": "no"
    },
    "stock_management": {
      "active": "yes"
    }
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`is_super_admin`). |
| `422` | Validation failed, or the referenced record does not exist. |
