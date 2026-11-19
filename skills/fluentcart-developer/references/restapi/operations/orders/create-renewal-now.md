# POST Create Renewal Now

## `POST /orders/{order}/subscriptions/{subscription}/create-renewal`

**POST Create Renewal Now**

Immediately create the next renewal order for a store-billed (manual or auto-charge) subscription, ahead of its scheduled billing date. Only valid for active or trialing subscriptions that have an upcoming billing date. For auto-charge (system) subscriptions, the newly created (or already-open) renewal is charged immediately and the response mirrors the charge-now endpoint; for manual subscriptions the renewal is created as a pay-now invoice and the customer is emailed.

**Required permission:** `subscriptions/manage`

- **operationId:** `createRenewalNow`
- **tags:** Orders

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `order` | path | yes | integer | Parent order ID the subscription belongs to. |
| `subscription` | path | yes | integer | Subscription ID. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Renewal created (manual subscriptions) or charged (auto-charge subscriptions). |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `404` | The 404 fires for whichever route-bound model resolves first: `order` or `subscription`. No order matches the given ID. Thrown by the framework's route-model-binding, not an explicit controller check, so the message is generic and names the model class. |
| `422` | The subscription is not eligible for an immediate renewal right now (wrong billing type, status, or a renewal already exists). |
