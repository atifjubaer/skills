# GET Get Country Tax Rates

## `GET /tax/rates/country/rates/{country_code}`

**GET Get Country Tax Rates**

Retrieve all tax rates for a specific country (ordered by priority, then ID), the country-level form configuration, and whether tax is enabled for the country.

**Required permission:** `store/settings`

- **operationId:** `getCountryTaxRates`
- **tags:** Tax

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `country_code` | path | yes | string | ISO 3166-1 alpha-2 country code (e.g., US, DE, GB) |
| `class_id` | query | no | integer | Optional tax class ID to filter the rates |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns tax rates for the specified country. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`store/settings`). |
| `422` | Validation failed, or the referenced record does not exist. |
