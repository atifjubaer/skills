# POST Save Checkout Fields

## `POST /checkout-fields/save-fields`

**POST Save Checkout Fields**

Update the checkout field visibility and required settings. The endpoint enforces name field logic automatically: if `first_name` or `last_name` is enabled, `full_name` is automatically disabled; if neither is enabled, `full_name` is automatically enabled and marked as required.

**Access policy:** `StoreSensitivePolicy`

**Access policy:** `StoreSensitivePolicy`

- **operationId:** `saveCheckoutFields`
- **tags:** Settings

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "settings"
  ],
  "properties": {
    "settings": {
      "type": "object",
      "description": "Checkout field settings object. Only keys matching existing settings are accepted.",
      "properties": {
        "basic_info": {
          "type": "object",
          "description": "Basic information field settings.",
          "additionalProperties": {
            "type": "object",
            "properties": {
              "enabled": {
                "type": "string",
                "description": "Whether the field is shown: `yes` or `no`.",
                "enum": [
                  "yes",
                  "no"
                ]
              },
              "required": {
                "type": "string",
                "description": "Whether the field is required: `yes` or `no`.",
                "enum": [
                  "yes",
                  "no"
                ]
              }
            }
          }
        },
        "billing_address": {
          "type": "object",
          "description": "Billing address field settings (same structure as `basic_info`).",
          "additionalProperties": {
            "type": "object",
            "properties": {
              "enabled": {
                "type": "string",
                "enum": [
                  "yes",
                  "no"
                ]
              },
              "required": {
                "type": "string",
                "enum": [
                  "yes",
                  "no"
                ]
              }
            }
          }
        },
        "shipping_address": {
          "type": "object",
          "description": "Shipping address field settings (same structure as `basic_info`).",
          "additionalProperties": {
            "type": "object",
            "properties": {
              "enabled": {
                "type": "string",
                "enum": [
                  "yes",
                  "no"
                ]
              },
              "required": {
                "type": "string",
                "enum": [
                  "yes",
                  "no"
                ]
              }
            }
          }
        }
      }
    }
  },
  "example": {
    "settings": {
      "basic_info": {
        "full_name": {
          "enabled": "no",
          "required": "no"
        },
        "first_name": {
          "enabled": "yes",
          "required": "yes"
        },
        "last_name": {
          "enabled": "yes",
          "required": "no"
        }
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
| `403` | Authenticated, but the user lacks the required capability. |
| `422` | Validation failed, or the referenced record does not exist. |
