# GET List All Tax Rates

## `GET /tax/rates`

**GET List All Tax Rates**

Retrieve all tax rates from the database, grouped by continent/region and country.

**Required permission:** `store/settings`

- **operationId:** `listAllTaxRates`
- **tags:** Tax

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns tax rates grouped by geographic region. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`store/settings`). |
