# DELETE Delete Attribute Group

## `DELETE /options/attr/group/{group_id}`

**DELETE Delete Attribute Group**

Delete an attribute group. The group can only be deleted if none of its terms are currently in use by any product variations. Deleting a group also deletes all its terms.

**Required permission:** `products/delete`

- **operationId:** `deleteAttributeGroup`
- **tags:** Labels

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | The attribute group ID to delete. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Attribute group deleted successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Group is in use by product variations. |
| `404` | Attribute group not found. |
| `422` | Validation failed, or the referenced record does not exist. |
