# POST Charge Subscription Now

## `POST /orders/{order}/subscriptions/{subscription}/charge-now`

**POST Charge Subscription Now**

Run one immediate off-session charge attempt against a subscription's open renewal invoice. Requires a store-billed (manual or auto-charge) subscription that already has a pending or scheduled renewal order. A declined card is returned as HTTP 200 with `status: "failed"` — the request itself succeeded, the charge attempt did not; only a state violation (e.g. no open renewal order to charge) returns an error response.

**Required permission:** `subscriptions/manage`

- **operationId:** `chargeNow`
- **tags:** Orders

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `order` | path | yes | integer | Parent order ID the subscription belongs to. |
| `subscription` | path | yes | integer | Subscription ID. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Charge attempt completed (may still report a failed charge in `status`). |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `404` | The 404 fires for whichever route-bound model resolves first: `order` (if the order ID doesn't exist) or `subscription` (if the order exists but the subscription ID doesn't, or doesn't belong to that order). No order matches the given ID. Thrown by the framework's route-model-binding, not an explicit controller check, so the message is generic and names the model class. |
| `422` | No open renewal order to charge, or the charge attempt could not be started. |
