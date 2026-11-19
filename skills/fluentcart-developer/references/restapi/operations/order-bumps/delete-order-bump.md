# DELETE Delete Order Bump

## `DELETE /order_bump/{id}`

**DELETE Delete Order Bump**

Permanently delete an order bump.

**Permission:** `store/sensitive` · **Policy:** `OrderBumpPolicy`

- **operationId:** `deleteOrderBump`
- **tags:** Order Bumps

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `id` | path | yes | integer | The order bump ID. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `400` | Error response |
