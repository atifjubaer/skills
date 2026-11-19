# POST Reset EU VAT Rates

## `POST /tax/configuration/settings/eu-vat/reset-rates`

**POST Reset EU VAT Rates**

Reset all country-level EU standard VAT rates back to the built-in defaults. Custom rate values and auto-generated labels are overwritten; state-specific entries and shipping overrides on the rows are preserved. No request body is required.

**Required permission:** `store/sensitive`

- **operationId:** `resetEuVatRates`
- **tags:** Tax

### Responses

| Status | Description |
| --- | --- |
| `200` | EU rates reset. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`store/sensitive`). |
| `422` | Validation failed, or the referenced record does not exist. |
