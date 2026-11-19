# POST Install Payment Addon

## `POST /settings/payment-methods/install-addon`

**POST Install Payment Addon**

Install a payment gateway addon plugin from a remote source (WordPress.org or GitHub).

**Required permission:** `is_super_admin`

- **operationId:** `installPaymentAddon`
- **tags:** Settings

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "plugin_slug",
    "source_type"
  ],
  "properties": {
    "plugin_slug": {
      "type": "string",
      "description": "The slug of the plugin to install (e.g., `fluent-cart-pro`).",
      "example": "fluent-cart-pro"
    },
    "source_type": {
      "type": "string",
      "description": "Source type: `wordpress` (WordPress.org) or `github`.",
      "enum": [
        "wordpress",
        "github"
      ],
      "example": "wordpress"
    },
    "source_link": {
      "type": "string",
      "description": "The URL to the plugin source. Required when `source_type` is `github`.",
      "example": "https://github.com/fluentcart/fluent-cart-pro"
    }
  },
  "example": {
    "plugin_slug": "fluent-cart-pro",
    "source_type": "wordpress"
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
