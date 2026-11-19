# GET Get Country Heat Map

## `GET /reports/country-heat-map`

**GET Get Country Heat Map**

Returns the number of orders per billing country, smallest first. It counts every order with a billing address, of any status, in all currencies, over all time.

The endpoint reads `params[currency]` but does not apply it. A country code that is not in the store's country list returns `country_code: null` and the name "Uncategorized".

**Permission:** `reports/view` · **Policy:** `ReportPolicy`

- **operationId:** `getCountryHeatMap`
- **tags:** Reports

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
