# GET Get Renewal Invoice Details

## `GET /renewals/{id}`

**GET Get Renewal Invoice Details**

Retrieve a single renewal invoice (an order of type `renewal`), including its customer, order items, and transactions.

**Required permission:** `orders/view`

- **operationId:** `show`
- **tags:** Orders

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `id` | path | yes | integer | Renewal order ID |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns the renewal invoice. |
| `401` | Authentication required. |
| `403` | The current user lacks the orders/view permission. |
| `404` | No renewal order matches the given ID. Uses the shared entity-not-found shape (`entityNotFoundError()`), which nests the message under `data` and includes admin-UI hints. |
| `422` | Validation failed, or the referenced record does not exist. |
