# POST Save Tax Settings

## `POST /tax/configuration/settings`

**POST Save Tax Settings**

Save the global tax configuration settings. Invalid enum values are silently replaced with their defaults. If tax is enabled, initial tax classes are automatically created.

**Required permission:** `store/sensitive`

- **operationId:** `saveTaxSettings`
- **tags:** Tax

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
      "properties": {
        "enable_tax": {
          "type": "string",
          "description": "Enable or disable tax calculation",
          "enum": [
            "yes",
            "no"
          ],
          "example": "yes"
        },
        "tax_inclusion": {
          "type": "string",
          "description": "Whether prices include tax",
          "enum": [
            "included",
            "excluded"
          ],
          "example": "excluded"
        },
        "tax_calculation_basis": {
          "type": "string",
          "description": "Address basis for tax calculation",
          "enum": [
            "shipping",
            "billing",
            "store"
          ],
          "example": "billing"
        },
        "tax_rounding": {
          "type": "string",
          "description": "Where tax rounding is applied",
          "enum": [
            "item",
            "total",
            "subtotal"
          ],
          "example": "subtotal"
        },
        "checkout_tax_breakdown_display": {
          "type": "string",
          "description": "How the tax breakdown is displayed at checkout",
          "enum": [
            "itemized",
            "simplified"
          ],
          "example": "itemized"
        },
        "tax_display_label": {
          "type": "string",
          "description": "Label used when displaying tax amounts",
          "example": "VAT"
        },
        "price_suffix_included": {
          "type": "string",
          "description": "Text appended after prices that include tax",
          "example": "incl. VAT"
        },
        "price_suffix_excluded": {
          "type": "string",
          "description": "Text appended after prices that exclude tax",
          "example": "excl. VAT"
        },
        "eu_vat_settings": {
          "type": "object",
          "description": "EU VAT configuration object",
          "properties": {
            "require_vat_number": {
              "type": "string",
              "enum": [
                "yes",
                "no"
              ]
            },
            "local_reverse_charge": {
              "type": "string",
              "enum": [
                "yes",
                "no"
              ]
            },
            "reverse_charge_price_mode": {
              "type": "string",
              "enum": [
                "fixed",
                "dynamic"
              ],
              "default": "fixed",
              "description": "Invalid values are replaced with fixed"
            },
            "vat_reverse_excluded_categories": {
              "type": "array",
              "items": {
                "type": "integer"
              }
            },
            "country_wise_vat": {
              "type": "array",
              "items": {
                "type": "object"
              }
            }
          }
        }
      }
    }
  },
  "example": {
    "settings": {
      "enable_tax": "yes",
      "tax_inclusion": "excluded",
      "tax_calculation_basis": "billing",
      "tax_rounding": "subtotal",
      "checkout_tax_breakdown_display": "itemized",
      "tax_display_label": "VAT",
      "price_suffix_included": "incl. VAT",
      "price_suffix_excluded": "excl. VAT",
      "eu_vat_settings": {
        "require_vat_number": "yes",
        "local_reverse_charge": "yes",
        "reverse_charge_price_mode": "fixed",
        "vat_reverse_excluded_categories": [
          12,
          15
        ],
        "country_wise_vat": []
      }
    }
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Settings saved successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`store/sensitive`). |
| `422` | Validation failed, or the referenced record does not exist. |
