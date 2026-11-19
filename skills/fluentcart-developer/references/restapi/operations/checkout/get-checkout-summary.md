# GET Get Checkout Summary

## `GET /checkout/get-checkout-summary-view`

**GET Get Checkout Summary**

Retrieve a rendered HTML summary of the current cart along with pricing totals. Used to dynamically update the checkout page when the customer changes shipping methods or other options.

**Access policy:** `PublicPolicy`

**Access policy:** `PublicPolicy`

- **operationId:** `getCheckoutSummary`
- **tags:** Checkout

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `shipping_method_id` | query | no | integer | ID of the selected shipping method to include its charge in the totals |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns cart summary with pricing totals. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
