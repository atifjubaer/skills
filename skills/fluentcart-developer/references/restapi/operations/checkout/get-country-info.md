# GET Get Country Info

## `GET /checkout/get-country-info`

**GET Get Country Info**

Retrieve localization details for a country including available states/provinces and address field configuration. Used by the checkout form to dynamically adjust address fields based on the selected country.

**Access policy:** `PublicPolicy`

**Access policy:** `PublicPolicy`

- **operationId:** `getCountryInfo`
- **tags:** Checkout

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `timezone` | query | no | string | IANA timezone string (e.g., `Asia/Tokyo`). Used to auto-detect the country. Either `timezone` or `country_code` must be provided |
| `country_code` | query | no | string | ISO 3166-1 alpha-2 country code (e.g., `US`, `JP`). Used when `timezone` is not provided |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns country localization details. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
