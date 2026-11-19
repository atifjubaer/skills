# POST Activate Payment Addon

## `POST /settings/payment-methods/activate-addon`

**POST Activate Payment Addon**

Activate an already-installed payment gateway addon plugin.

**Required permission:** `is_super_admin`

- **operationId:** `activatePaymentAddon`
- **tags:** Settings

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "plugin_file"
  ],
  "properties": {
    "plugin_file": {
      "type": "string",
      "description": "The plugin file path (e.g., `fluent-cart-pro/fluent-cart-pro.php`).",
      "example": "fluent-cart-pro/fluent-cart-pro.php"
    }
  },
  "example": {
    "plugin_file": "fluent-cart-pro/fluent-cart-pro.php"
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
