# GET Get Available Shipping Methods

## `GET /checkout/get-available-shipping-methods`

**GET Get Available Shipping Methods**

Retrieve shipping methods available for a given country and state. The country can be auto-detected from the customer's timezone or provided directly via country code.

**Access policy:** `PublicPolicy`

**Access policy:** `PublicPolicy`

- **operationId:** `getAvailableShippingMethods`
- **tags:** Checkout

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `timezone` | query | no | string | IANA timezone string (e.g., `America/New_York`, `Europe/London`). Used to auto-detect the country. Either `timezone` or `country_code` must be provided |
| `country_code` | query | no | string | ISO 3166-1 alpha-2 country code (e.g., `US`, `GB`). Used when `timezone` is not provided |
| `state` | query | no | string | State/province code to further filter applicable shipping methods |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns available shipping methods for the given location. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
