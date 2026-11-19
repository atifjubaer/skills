# GET Get Order Info

## `GET /checkout/get-order-info`

**GET Get Order Info**

Retrieve payment-gateway-specific order information needed by the frontend to initialize payment UI elements. This is typically called after the checkout page loads to set up payment forms (e.g., Stripe Elements configuration, PayPal button setup).

**Access policy:** `PublicPolicy`

**Access policy:** `PublicPolicy`

- **operationId:** `getOrderInfo`
- **tags:** Checkout

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `method` | query | yes | string | Payment gateway slug (e.g., `stripe`, `paypal`, `square`, `airwallex`) |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. The response structure is gateway-specific. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
