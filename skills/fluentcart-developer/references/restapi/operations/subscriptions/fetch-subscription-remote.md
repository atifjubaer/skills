# PUT Fetch Subscription from Remote

## `PUT /orders/{order}/subscriptions/{subscription}/fetch`

**PUT Fetch Subscription from Remote**

Re-sync a subscription's data from the remote payment gateway (e.g., Stripe, PayPal). Useful for resolving data inconsistencies between local records and the payment provider.

**Required permission:** `subscriptions/manage`

- **operationId:** `fetchSubscriptionRemote`
- **tags:** Subscriptions

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `order` | path | yes | integer | The parent order ID |
| `subscription` | path | yes | integer | The subscription ID |

### Responses

| Status | Description |
| --- | --- |
| `200` | Subscription fetched successfully from remote gateway |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`subscriptions/manage`). |
| `422` | Gateway error |
