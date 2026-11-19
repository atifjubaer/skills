# DELETE Delete Tax Rate

## `DELETE /tax/country/rate/{id}`

**DELETE Delete Tax Rate**

Delete a single tax rate by ID.

**Required permission:** `store/sensitive`

- **operationId:** `deleteTaxRate`
- **tags:** Tax

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `id` | path | yes | integer | Tax rate ID |

### Responses

| Status | Description |
| --- | --- |
| `200` | Tax rate deleted successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`store/sensitive`). |
| `422` | Validation failed, or the referenced record does not exist. |
