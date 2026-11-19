# POST Update Attribute Term

## `POST /options/attr/group/{group_id}/term/{term_id}`

**POST Update Attribute Term**

Update an existing attribute term.

**Required permission:** `products/edit`

- **operationId:** `updateAttributeTerm`
- **tags:** Labels

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | The attribute group ID. |
| `term_id` | path | yes | integer | The term ID to update. |

### Request body

`application/json`

```json
{
  "$ref": "#/components/schemas/UpdateAttributeTermRequest"
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Attribute term updated successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`products/edit`). |
| `404` | Term not found or group mismatch. |
| `422` | Validation failed, or the referenced record does not exist. |
