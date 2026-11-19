# GET Get Shipping Methods List View

## `GET /checkout/get-shipping-methods-list-view`

**GET Get Shipping Methods List View**

Retrieve a server-rendered HTML view of available shipping methods for the checkout page. This endpoint wraps get-available-shipping-methods and returns a pre-rendered HTML list suitable for direct insertion into the checkout form.

**Access policy:** `PublicPolicy`

**Access policy:** `PublicPolicy`

- **operationId:** `getShippingMethodsListView`
- **tags:** Checkout

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `timezone` | query | no | string | IANA timezone string (e.g., `America/New_York`). Used to auto-detect the country. Either `timezone` or `country_code` must be provided |
| `country_code` | query | no | string | ISO 3166-1 alpha-2 country code (e.g., `US`, `GB`). Used when `timezone` is not provided |
| `state` | query | no | string | State/province code to further filter applicable shipping methods |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns rendered HTML of shipping methods. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
