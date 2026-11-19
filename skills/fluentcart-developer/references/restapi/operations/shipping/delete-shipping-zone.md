# DELETE Delete Shipping Zone

## `DELETE /shipping/zones/{id}`

**DELETE Delete Shipping Zone**

Delete a shipping zone and all its associated shipping methods.

**Access policy:** `StoreSensitivePolicy`

**Access policy:** `StoreSensitivePolicy`

- **operationId:** `deleteShippingZone`
- **tags:** Shipping

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `id` | path | yes | integer | The shipping zone ID |

### Responses

| Status | Description |
| --- | --- |
| `200` | Shipping zone deleted successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `422` | Validation failed, or the referenced record does not exist. |
