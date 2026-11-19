# GET Get Payment Method Settings

## `GET /settings/payment-methods`

**GET Get Payment Method Settings**

Retrieve the configuration and settings for a specific payment method gateway (e.g., Stripe, PayPal).

**Required permission:** `is_super_admin`

- **operationId:** `getPaymentMethodSettings`
- **tags:** Settings

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `method` | query | yes | string | The payment method key to retrieve settings for (e.g., `stripe`, `paypal`, `cod`). |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`is_super_admin`). |
