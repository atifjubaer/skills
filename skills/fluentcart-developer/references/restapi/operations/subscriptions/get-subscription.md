# GET Get Subscription Details

## `GET /subscriptions/{subscriptionOrderId}`

**GET Get Subscription Details**

Retrieve the full details of a single subscription including customer addresses, labels, activities, and related orders.

**Required permission:** `subscriptions/view`

- **operationId:** `getSubscription`
- **tags:** Subscriptions

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `subscriptionOrderId` | path | yes | integer | The subscription ID |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns the subscription with eager-loaded relations including labels, activities, customer addresses, and related orders. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`subscriptions/view`). |
| `404` | Subscription not found |
| `422` | Validation failed, or the referenced record does not exist. |
