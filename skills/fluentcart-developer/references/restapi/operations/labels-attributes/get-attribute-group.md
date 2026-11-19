# GET Get Attribute Group

## `GET /options/attr/group/{group_id}`

**GET Get Attribute Group**

Retrieve a single attribute group by ID, optionally with its terms.

**Required permission:** `products/view`

- **operationId:** `getAttributeGroup`
- **tags:** Labels

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | The attribute group ID. |
| `with[]` | query | no | array | Relations to eager load. Supported: `terms`. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns the attribute group with optional terms. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`products/view`). |
| `422` | Validation failed, or the referenced record does not exist. |
