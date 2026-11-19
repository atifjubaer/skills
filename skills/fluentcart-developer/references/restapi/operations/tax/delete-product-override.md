# DELETE Delete Product Category Tax Override

## `DELETE /tax/product-overrides/{id}`

**DELETE Delete Product Category Tax Override**

Delete a product category tax override by its ID.

**Required permission:** `store/sensitive`

- **operationId:** `deleteProductOverride`
- **tags:** Tax

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `id` | path | yes | integer | Override (meta row) ID |

### Responses

| Status | Description |
| --- | --- |
| `200` | Override deleted. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`store/sensitive`). |
| `422` | Override not found. |
