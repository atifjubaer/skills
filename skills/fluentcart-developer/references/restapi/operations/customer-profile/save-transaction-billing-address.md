# PUT Save Transaction Billing Address

## `PUT /customer-profile/orders/{transaction_uuid}/billing-address`

**PUT Save Transaction Billing Address**

Create or update the billing address for a specific transaction's order. Also stores the VAT/Tax ID as order metadata. Validates address fields against country-specific rules.

**Access policy:** `CustomerFrontendPolicy`

**Access policy:** `CustomerFrontendPolicy`

- **operationId:** `saveTransactionBillingAddress`
- **tags:** Customer Profile

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `transaction_uuid` | path | yes | string | The UUID of the transaction (alphanumeric with dashes) |

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "name",
    "country"
  ],
  "properties": {
    "address_id": {
      "type": "string",
      "description": "Existing order address ID to update. If empty, a new address is created."
    },
    "name": {
      "type": "string",
      "description": "Contact name"
    },
    "address_1": {
      "type": "string",
      "description": "Primary street address. Required based on country validation rules."
    },
    "address_2": {
      "type": "string",
      "description": "Secondary address line"
    },
    "city": {
      "type": "string",
      "description": "City. Required based on country validation rules."
    },
    "state": {
      "type": "string",
      "description": "State/province code. Required for countries with states."
    },
    "postcode": {
      "type": "string",
      "description": "Postal/zip code. Validated against country-specific format."
    },
    "country": {
      "type": "string",
      "description": "Country code (e.g., `US`, `GB`)"
    },
    "vat_tax_id": {
      "type": "string",
      "description": "VAT or Tax ID. Stored as order meta."
    }
  },
  "example": {
    "address_id": "15",
    "name": "John Doe",
    "address_1": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postcode": "10001",
    "country": "US",
    "vat_tax_id": "EU123456789"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Address created or updated. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `404` | Order not found. |
| `422` | Validation error. |
