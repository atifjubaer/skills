# PUT Update Attribute Group

## `PUT /options/attr/group/{group_id}`

**PUT Update Attribute Group**

Update an existing attribute group.

**Required permission:** `products/edit`

- **operationId:** `updateAttributeGroup`
- **tags:** Labels

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | The attribute group ID. |

### Request body

`application/json`

```json
{
  "$ref": "#/components/schemas/UpdateAttributeGroupRequest"
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Attribute group updated successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`products/edit`). |
| `422` | Validation error - duplicate title or slug. |
