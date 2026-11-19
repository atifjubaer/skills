# POST Save Country Tax ID

## `POST /tax/country-tax-id/{country_code}`

**POST Save Country Tax ID**

Save or update the store's tax identification number for a specific country.

**Required permission:** `store/sensitive`

- **operationId:** `saveCountryTaxId`
- **tags:** Tax

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `country_code` | path | yes | string | ISO 3166-1 alpha-2 country code (e.g., US, DE) |

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "tax_id"
  ],
  "properties": {
    "tax_id": {
      "type": "string",
      "description": "The tax identification number (e.g., VAT number, EIN, GST number)",
      "example": "DE123456789"
    }
  },
  "example": {
    "tax_id": "DE123456789"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Tax ID saved successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`store/sensitive`). |
| `422` | Validation failed, or the referenced record does not exist. |
