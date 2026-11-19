# GET Select Address for Checkout

## `GET /customers/{customerAddressId}/update-address-select`

**GET Select Address for Checkout**

Select an existing address and apply it to the current cart/checkout session. Updates the cart's checkout data with the selected address and returns the rendered address HTML along with updated checkout fragments.

**Access policy:** `PublicPolicy`

**Access policy:** `PublicPolicy`

- **operationId:** `selectAddressForCheckout`
- **tags:** Customer Profile

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `customerAddressId` | path | yes | integer | The address record ID to select |
| `with` | query | no | array | Relationships to eager-load on the address |
| `fct_cart_hash` | query | no | string | Cart hash identifier to locate the active cart session |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns the address HTML and updated checkout fragments. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Forbidden. The authenticated user does not own this address. |
| `404` | Address not found. |
| `422` | Validation failed, or the referenced record does not exist. |
