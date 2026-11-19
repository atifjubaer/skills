# POST Sync Pending Transaction

## `POST /orders/{order}/transactions/{transaction}/sync`

**POST Sync Pending Transaction**

Re-fetch a pending transaction's current status directly from its payment gateway and update the local record to match. Use this to reconcile a transaction stuck in a pending state after a webhook was missed or delayed.

**Required permission:** `orders/manage`

- **operationId:** `syncPendingTransaction`
- **tags:** Orders

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `order` | path | yes | integer | Order ID the transaction belongs to. |
| `transaction` | path | yes | integer | Transaction ID to sync. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Transaction synced from the payment gateway successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `404` | The 404 fires for whichever route-bound model resolves first: `order` (the plain `$order` string) is not model-bound here, only `transaction` is, so this only fires when the transaction ID doesn't exist. No ordertransaction matches the given ID. Thrown by the framework's route-model-binding, not an explicit controller check, so the message is generic and names the model class. |
| `422` | The transaction does not belong to the given order, or the gateway sync failed. |
