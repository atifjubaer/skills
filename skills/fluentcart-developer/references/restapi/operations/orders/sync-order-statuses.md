# PUT Sync Order Statuses

## `PUT /orders/{order}/sync-statuses`

**PUT Sync Order Statuses**

Synchronize the order's status and payment status based on the latest transaction data. Useful for resolving status mismatches.

**Required permission:** `orders/manage`

- **operationId:** `syncOrderStatuses`
- **tags:** Orders

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `order` | path | yes | integer | Order ID |

### Responses

| Status | Description |
| --- | --- |
| `200` | Order statuses synced successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`orders/manage`). |
| `404` | No transaction found. |
| `422` | Validation failed, or the referenced record does not exist. |
