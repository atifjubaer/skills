# GET Check PayPal Webhook

## `GET /settings/payment-methods/paypal/webhook/check`

**GET Check PayPal Webhook**

Verify the current PayPal webhook registration status and set up the webhook if it is missing. If no PayPal API key has been connected yet for the given `mode`, returns `status`/`message` explaining that PayPal must be connected first. Otherwise it looks up (or registers) the webhook and returns the raw PayPal webhook object (`id`, `url`, `event_types`, `status`) verbatim.

**Required permission:** `super_admin`

- **operationId:** `checkPaypalWebhook`
- **tags:** Settings

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `mode` | query | yes | string | Environment mode: `test` or `live`. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns either a not-connected status message, or the webhook configuration details from PayPal. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`super_admin`). |
