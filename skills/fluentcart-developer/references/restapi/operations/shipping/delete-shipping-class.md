# DELETE Delete Shipping Class

## `DELETE /shipping/classes/{id}`

**DELETE Delete Shipping Class**

Delete a shipping class by ID.

**Access policy:** `StoreSensitivePolicy`

**Access policy:** `StoreSensitivePolicy`

- **operationId:** `deleteShippingClass`
- **tags:** Shipping

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `id` | path | yes | integer | The shipping class ID |

### Responses

| Status | Description |
| --- | --- |
| `200` | Shipping class deleted successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `422` | Validation failed, or the referenced record does not exist. |
