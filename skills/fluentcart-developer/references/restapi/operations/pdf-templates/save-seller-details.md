# POST Save Seller Details

## `POST /settings/pdf-templates/seller-details`

**POST Save Seller Details**

Save the E-Invoice seller details.

Validation runs before anything is written and returns **all** failures at once in `data`, keyed by field. Enabling ZUGFeRD (`zugferd_enabled: "1"`) additionally requires, from **Store Settings** rather than this payload, either a seller VAT ID or a legal registration ID, plus a store country.

**Permission:** `is_super_admin` (`manage_options`) · **Policy:** `StoreSensitivePolicy`

- **operationId:** `saveSellerDetails`
- **tags:** PDF Templates

### Request body

`application/json`

```json
{
  "type": "object",
  "properties": {
    "zugferd_enabled": {
      "type": "string",
      "description": "`\"1\"` enables ZUGFeRD/Factur-X e-invoice embedding, `\"0\"` disables it."
    },
    "zugferd_profile": {
      "type": "string",
      "description": "ZUGFeRD conformance profile, e.g. `en16931`."
    },
    "seller_legal_registration_scheme": {
      "type": "string",
      "description": "ISO 6523 ICD code identifying the registration scheme. Validated against a fixed list."
    },
    "seller_contact_name": {
      "type": "string"
    },
    "seller_contact_email": {
      "type": "string",
      "description": "Validated with `is_email()` when non-empty."
    },
    "seller_contact_phone": {
      "type": "string"
    },
    "seller_bank_iban": {
      "type": "string",
      "description": "Validated as 2 letters + 2 digits + 4–30 alphanumerics, ignoring whitespace."
    },
    "seller_bank_bic": {
      "type": "string"
    },
    "seller_bank_account_name": {
      "type": "string"
    },
    "seller_electronic_address": {
      "type": "string"
    },
    "seller_vat_id": {
      "type": "string"
    },
    "seller_tax_id": {
      "type": "string"
    },
    "seller_legal_name": {
      "type": "string"
    },
    "seller_legal_registration_id": {
      "type": "string"
    }
  },
  "example": {
    "zugferd_enabled": "1",
    "zugferd_profile": "en16931",
    "seller_legal_registration_scheme": "0198",
    "seller_contact_name": "Alex Morgan",
    "seller_contact_email": "alex.morgan@example.com",
    "seller_contact_phone": "+1 555 0100",
    "seller_bank_iban": "DE89370400440532013000",
    "seller_bank_bic": "COBADEFFXXX",
    "seller_bank_account_name": "Example Retail Co.",
    "seller_electronic_address": "billing@example.com",
    "seller_vat_id": "DE123456789",
    "seller_tax_id": "12/345/67890",
    "seller_legal_name": "Example Retail Co.",
    "seller_legal_registration_id": "HRB 12345"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `403` | Forbidden — the user is not a super admin. |
| `422` | Validation failed. Nothing was saved. |
