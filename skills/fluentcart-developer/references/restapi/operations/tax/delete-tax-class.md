# DELETE Delete Tax Class

## `DELETE /tax/classes/{id}`

**DELETE Delete Tax Class**

Delete a tax class by ID.

**Required permission:** `store/sensitive`

- **operationId:** `deleteTaxClass`
- **tags:** Tax

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `id` | path | yes | integer | Tax class ID |

### Responses

| Status | Description |
| --- | --- |
| `200` | Tax class deleted successfully. |
| `400` | Failed to delete tax class. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`store/sensitive`). |
| `422` | Validation failed, or the referenced record does not exist. |
