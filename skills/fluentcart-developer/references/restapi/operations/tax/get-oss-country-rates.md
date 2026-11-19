# GET Get OSS Country Rates

## `GET /tax/configuration/settings/eu-vat/oss-rates`

**GET Get OSS Country Rates**

Retrieve per-country EU VAT rates for every tax class. Each country entry includes the effective rate per class (custom database value or built-in default), plus top-level standard-class values for backward compatibility, and the list of tax classes.

**Required permission:** `store/settings`

- **operationId:** `getOssCountryRates`
- **tags:** Tax

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns EU country rates per tax class. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`store/settings`). |
