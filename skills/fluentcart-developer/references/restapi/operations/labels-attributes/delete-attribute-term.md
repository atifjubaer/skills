# DELETE Delete Attribute Term

## `DELETE /options/attr/group/{group_id}/term/{term_id}`

**DELETE Delete Attribute Term**

Delete an attribute term. The term can only be deleted if it is not currently in use by any product variations.

**Required permission:** `products/delete`

- **operationId:** `deleteAttributeTerm`
- **tags:** Labels

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | The attribute group ID. |
| `term_id` | path | yes | integer | The term ID to delete. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Attribute term deleted successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Term is in use by product variations. |
| `404` | Term not found or group mismatch. |
| `422` | Validation failed, or the referenced record does not exist. |
