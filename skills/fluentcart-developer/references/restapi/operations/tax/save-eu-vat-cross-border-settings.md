# POST Save EU VAT Cross-Border Settings

## `POST /tax/configuration/settings/eu-vat`

**POST Save EU VAT Cross-Border Settings**

Multi-action endpoint for EU VAT settings, dispatched by the action field: euCrossBorderSettings saves the cross-border registration configuration (OSS, home country, or specific country registrations); saveCountryRegistration creates or updates a per-country VAT registration with per-class rates; deleteCountryRegistration removes a per-country VAT registration.

**Required permission:** `store/sensitive`

- **operationId:** `saveEuVatCrossBorderSettings`
- **tags:** Tax

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "action"
  ],
  "properties": {
    "action": {
      "type": "string",
      "description": "Which operation to perform",
      "enum": [
        "euCrossBorderSettings",
        "saveCountryRegistration",
        "deleteCountryRegistration"
      ],
      "example": "euCrossBorderSettings"
    },
    "eu_vat_settings": {
      "type": "object",
      "description": "euCrossBorderSettings only. Merged into the stored eu_vat_settings",
      "properties": {
        "method": {
          "type": "string",
          "description": "Cross-border method (required)",
          "enum": [
            "oss",
            "home",
            "specific"
          ],
          "example": "oss"
        },
        "oss_country": {
          "type": "string",
          "description": "Country of OSS registration (required when method is oss; must be an EU VAT country)",
          "example": "DE"
        },
        "oss_vat": {
          "type": "string",
          "description": "OSS VAT number",
          "example": "DE123456789"
        },
        "home_country": {
          "type": "string",
          "description": "Home country code (required when method is home; must be an EU VAT country)"
        },
        "home_vat": {
          "type": "string",
          "description": "Home VAT number"
        }
      }
    },
    "reset_registration": {
      "type": "string",
      "description": "euCrossBorderSettings only. Set to yes to clear the current method (reset registration)",
      "enum": [
        "yes",
        "no"
      ],
      "example": "no"
    },
    "country": {
      "type": "string",
      "description": "saveCountryRegistration / deleteCountryRegistration. ISO 3166-1 alpha-2 code of an EU VAT country (required)",
      "example": "DE"
    },
    "vat": {
      "type": "string",
      "maxLength": 50,
      "description": "saveCountryRegistration only. VAT registration number (max 50 characters)",
      "example": "DE123456789"
    },
    "rates": {
      "type": "object",
      "description": "saveCountryRegistration only. Per-class rates keyed by tax class slug; at least one rate must be greater than 0 and every slug must reference an existing tax class",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "rate": {
            "type": "number",
            "description": "Tax rate percentage",
            "example": 19
          },
          "label": {
            "type": "string",
            "description": "Rate label",
            "example": "VAT"
          }
        }
      }
    }
  },
  "example": {
    "action": "euCrossBorderSettings",
    "eu_vat_settings": {
      "method": "oss",
      "oss_country": "DE",
      "oss_vat": "DE123456789"
    }
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Settings saved. The message depends on the action: "EU VAT settings saved successfully", "Country VAT registration saved successfully", or "Country registration removed successfully". |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`store/sensitive`). |
| `422` | Unknown action ("Invalid method") or validation failed for the given action. |
