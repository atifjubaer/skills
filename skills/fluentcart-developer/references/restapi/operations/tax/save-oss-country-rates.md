# POST Save OSS Country Rates

## `POST /tax/configuration/settings/eu-vat/oss-rates`

**POST Save OSS Country Rates**

Save per-country EU VAT rates. Each entry may provide class_rates keyed by tax class slug ({rate, label}); rates are upserted per country and class in the EU group. When class_rates is omitted, the single rate value is applied to the standard class (backward compatibility). Entries with unknown tax class slugs or without a country are skipped.

**Required permission:** `store/sensitive`

- **operationId:** `saveOssCountryRates`
- **tags:** Tax

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "rates"
  ],
  "properties": {
    "rates": {
      "type": "array",
      "description": "Array of country rate entries",
      "items": {
        "type": "object",
        "required": [
          "country"
        ],
        "properties": {
          "country": {
            "type": "string",
            "description": "ISO 3166-1 alpha-2 code of an EU VAT country",
            "example": "DE"
          },
          "tax_label": {
            "type": "string",
            "description": "Shared label fallback for classes without their own label",
            "example": "VAT"
          },
          "rate": {
            "type": "number",
            "description": "Standard-class rate (used only when class_rates is omitted)",
            "example": 19
          },
          "class_rates": {
            "type": "object",
            "description": "Per-class rates keyed by tax class slug",
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
                  "description": "Rate label for this class",
                  "example": "VAT"
                }
              }
            }
          }
        }
      }
    }
  },
  "example": {
    "rates": [
      {
        "country": "DE",
        "tax_label": "VAT",
        "class_rates": {
          "standard": {
            "rate": 19,
            "label": "VAT"
          },
          "reduced": {
            "rate": 7,
            "label": "Reduced VAT"
          }
        }
      }
    ]
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | OSS country rates saved. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`store/sensitive`). |
| `422` | Validation failed — one or more entries reference a non-EU VAT country. |
