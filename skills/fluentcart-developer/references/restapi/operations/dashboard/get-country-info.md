# GET Get Country Info

## `GET /address-info/get-country-info`

**GET Get Country Info**

Retrieve detailed information for a specific country including states/provinces and address locale formatting rules. Can identify the country from either a country code or a timezone string.

**Access policy:** `UserPolicy`

**Access policy:** `UserPolicy`

- **operationId:** `getCountryInfo`
- **tags:** Dashboard

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `country_code` | query | no | string | Two-letter ISO country code (e.g., US, GB). Required if timezone is not provided. |
| `timezone` | query | no | string | IANA timezone string (e.g., America/New_York). Used to guess the country. Takes priority over country_code. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
