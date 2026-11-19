# GET Get Payment Method Connection Info

## `GET /settings/payment-methods/connect/info`

**GET Get Payment Method Connection Info**

Retrieve connection information (OAuth URLs, account status) for a connectable payment gateway.

**Required permission:** `is_super_admin`

- **operationId:** `getPaymentMethodConnectionInfo`
- **tags:** Settings

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `method` | query | yes | string | The payment method key (e.g., `stripe`, `paypal`). |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`is_super_admin`). |
