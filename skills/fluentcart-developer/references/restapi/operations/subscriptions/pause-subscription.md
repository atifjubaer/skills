# PUT Pause Subscription

## `PUT /orders/{order}/subscriptions/{subscription}/pause`

**PUT Pause Subscription**

Pause an active subscription. Note: This endpoint is registered but currently returns a 'Not available yet' error. It is reserved for future implementation.

**Required permission:** `subscriptions/manage`

- **operationId:** `pauseSubscription`
- **tags:** Subscriptions

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `order` | path | yes | integer | The parent order ID |
| `subscription` | path | yes | integer | The subscription ID |

### Responses

| Status | Description |
| --- | --- |
| `200` | Not yet available |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`subscriptions/manage`). |
| `422` | Validation failed, or the referenced record does not exist. |
