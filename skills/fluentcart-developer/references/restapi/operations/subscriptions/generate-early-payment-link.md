# POST Generate Early Payment Link

## `POST /orders/{order}/subscriptions/{subscription}/early-payment-link`

**POST Generate Early Payment Link**

Generate a URL that allows early payment of remaining installments on an installment-based subscription. Requires early payment feature to be enabled, the subscription must belong to the specified order, have finite installments, be active or trialing, and have remaining installments.

**Required permission:** `subscriptions/manage`

- **operationId:** `generateEarlyPaymentLink`
- **tags:** Subscriptions

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `order` | path | yes | integer | The parent order ID |
| `subscription` | path | yes | integer | The subscription ID |

### Responses

| Status | Description |
| --- | --- |
| `200` | Early payment link generated successfully |
| `400` | Bad request - various validation errors |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`subscriptions/manage`). |
| `422` | Validation failed, or the referenced record does not exist. |
