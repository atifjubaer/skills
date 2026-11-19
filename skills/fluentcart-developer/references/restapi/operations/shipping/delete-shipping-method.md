# DELETE Delete Shipping Method

## `DELETE /shipping/methods/{method_id}`

**DELETE Delete Shipping Method**

Delete a shipping method by ID.

**Access policy:** `StoreSensitivePolicy`

**Access policy:** `StoreSensitivePolicy`

- **operationId:** `deleteShippingMethod`
- **tags:** Shipping

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `method_id` | path | yes | integer | The shipping method ID |

### Responses

| Status | Description |
| --- | --- |
| `200` | Shipping method deleted successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `422` | Validation failed, or the referenced record does not exist. |
