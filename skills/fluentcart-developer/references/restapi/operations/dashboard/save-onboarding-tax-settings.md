# POST Save Onboarding Tax Settings

## `POST /onboarding/save-tax`

**POST Save Onboarding Tax Settings**

Save the store's tax configuration as part of onboarding. When `enable_tax` is "no", tax is simply switched off. When it is "yes", the store country is used to determine whether EU VAT handling applies; if it does, tax classes are generated for all EU countries and, for the OSS method, an EU VAT registration is upserted. For non-EU countries with a VAT number, a `fluent_cart_tax_id_{country}` meta record is created or updated instead.

**Access policy:** `AdminPolicy`

- **operationId:** `saveTaxSettings`
- **tags:** Dashboard

### Request body

`application/json`

```json
{
  "type": "object",
  "properties": {
    "enable_tax": {
      "type": "string",
      "description": "\"yes\" or \"no\". Defaults to \"no\". Any other value returns a 422.",
      "enum": [
        "yes",
        "no"
      ]
    },
    "tax_inclusion": {
      "type": "string",
      "description": "\"included\" or \"excluded\". Only read when enable_tax is \"yes\". Defaults to \"excluded\". Any other value returns a 422.",
      "enum": [
        "included",
        "excluded"
      ]
    },
    "store_country": {
      "type": "string",
      "description": "Store's country code, uppercased server-side. Must be alphabetic and at most 3 characters, or a 422 is returned. Only read when enable_tax is \"yes\"."
    },
    "eu_method": {
      "type": "string",
      "description": "\"oss\", \"home\", or \"specific\". Only required/validated when store_country resolves to an EU tax country. Defaults to \"oss\".",
      "enum": [
        "oss",
        "home",
        "specific"
      ]
    },
    "vat_number": {
      "type": "string",
      "description": "VAT number, truncated to 50 characters. Stored against the EU VAT registration for EU countries, or as tax meta for non-EU countries."
    }
  },
  "example": {
    "enable_tax": "yes",
    "tax_inclusion": "excluded",
    "store_country": "DE",
    "eu_method": "oss",
    "vat_number": "DE123456789"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Tax settings saved successfully. |
| `401` | Unauthenticated. |
| `403` | The authenticated user is not an admin. |
| `422` | An invalid enable_tax, tax_inclusion, store_country, or eu_method value was supplied. |
