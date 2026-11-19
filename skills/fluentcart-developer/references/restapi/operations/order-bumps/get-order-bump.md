# GET Get Order Bump

## `GET /order_bump/{id}`

**GET Get Order Bump**

Retrieve detailed information about a specific order bump, including its configuration, conditions, and associated product variant.

**Permission:** `store/sensitive` · **Policy:** `OrderBumpPolicy`

- **operationId:** `getOrderBump`
- **tags:** Order Bumps

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `id` | path | yes | integer | The order bump ID. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `404` | Order bump not found |
