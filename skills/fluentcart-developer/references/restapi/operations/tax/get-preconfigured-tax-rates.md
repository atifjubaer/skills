# GET Get Preconfigured Tax Rates

## `GET /tax/configuration/rates`

**GET Get Preconfigured Tax Rates**

Retrieve the full list of preconfigured tax rates from the built-in tax rates data file. These are the default rates organized by continent/region (`EU`, `NA`, `SA`, `AS`, `AF`, `OC`, `REST`) and country.

**Required permission:** `store/settings`

- **operationId:** `getPreconfiguredTaxRates`
- **tags:** Tax

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns preconfigured tax rates grouped by geographic region. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`store/settings`). |
